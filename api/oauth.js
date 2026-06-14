// Vercel Serverless Function — GitHub OAuth proxy
// Deploy to Vercel and set env vars: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

export default async function handler(req, res) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  const redirectUri = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/oauth`
    : 'http://localhost:8888/api/oauth';

  const url = new URL(req.url, `http://${req.headers.host}`);
  const code = url.searchParams.get('code');

  if (!code) {
    // Step 1: redirect to GitHub for authorization
    const githubAuthUrl = 'https://github.com/login/oauth/authorize?' +
      `client_id=${GITHUB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      'scope=public_repo';

    res.writeHead(302, { Location: githubAuthUrl });
    res.end();
    return;
  }

  // Step 2: exchange code for access token
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: data.error_description || data.error }));
      return;
    }

    // Return token as JSON (the client-side script will store it)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ access_token: data.access_token }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Token exchange failed' }));
  }
}
