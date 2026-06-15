// Vercel Serverless Function — Page view counter
// Stores counter as counter.json in the GitHub repo itself via GitHub API
// Requires GH_PAT env var (GitHub Personal Access Token with repo scope)

const OWNER = 'SunXT-0719';
const REPO = 'SunXT-0719.github.io';
const PATH = 'counter.json';
const BRANCH = 'main';

async function gh(path, opts) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `token ${process.env.GH_PAT}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.end(); return; }

  try {
    if (!process.env.GH_PAT) {
      return Response.json({ uv: 1, pv: 1 }, { status: 200 });
    }

    // Read current counter file from repo
    let data = { uv: 0, pv: 0, visitors: [] };
    let sha = null;
    try {
      const file = await gh(PATH, { method: 'GET' });
      data = JSON.parse(Buffer.from(file.content, 'base64').toString());
      sha = file.sha;
    } catch (e) { /* file doesn't exist yet */ }

    if (req.method === 'GET') {
      return Response.json({ uv: data.uv, pv: data.pv });
    }

    // POST: increment
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const visitorKey = (body.visitor || 'unknown').substring(0, 64);

    data.pv += 1;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    data.visitors = (data.visitors || []).filter(v => now - v.time < oneDay);
    if (!data.visitors.find(v => v.key === visitorKey)) {
      data.visitors.push({ key: visitorKey, time: now });
      data.uv += 1;
    }

    // Write back
    const content = Buffer.from(JSON.stringify(data)).toString('base64');
    await gh(PATH, {
      method: 'PUT',
      body: JSON.stringify({ message: 'counter: update', content, sha, branch: BRANCH }),
    });

    return Response.json({ uv: data.uv, pv: data.pv });
  } catch (err) {
    return Response.json({ uv: 0, pv: 0, error: err.message }, { status: 500 });
  }
}
