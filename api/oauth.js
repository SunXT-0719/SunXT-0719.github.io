// Vercel Serverless Function — GitHub OAuth proxy

export default async function handler(req, res) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  const redirectUri = 'https://githubio-eight.vercel.app/api/oauth';
  const siteUrl = 'https://sunxt-0719.github.io';

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

  // Step 2: exchange code for access token, then redirect back to site
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
      res.writeHead(302, { Location: siteUrl + '?error=' + encodeURIComponent(data.error_description || data.error) });
      res.end();
      return;
    }

    // Redirect back to site — token in query param, JS will clean URL after reading
    res.writeHead(302, { Location: siteUrl + '?gh_token=' + data.access_token });
    res.end();
  } catch (err) {
    res.writeHead(302, { Location: siteUrl + '?error=token_exchange_failed' });
    res.end();
  }
}
