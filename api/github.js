// POST /api/github : lets the admin panel edit products.js, store-config.js and product photos through the server,
// so the browser never has to talk to GitHub directly. Needs Vercel env var GITHUB_TOKEN (Contents: read & write).
const crypto = require('crypto');
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'POST only' });
  if (!process.env.ADMIN_KEY || !same(req.headers['x-admin-key'] || '', process.env.ADMIN_KEY)) return res.status(401).json({ message: 'Wrong admin key' });
  const env = (...k) => { for (const n of k) { const v = String(process.env[n] || '').trim().replace(/^["']|["']$/g, '').trim(); if (v) return v; } return ''; };
  const repo = (env('GITHUB_REPO', 'GITHUB_REPOSITORY') || (env('VERCEL_GIT_REPO_OWNER') && env('VERCEL_GIT_REPO_SLUG') ? env('VERCEL_GIT_REPO_OWNER') + '/' + env('VERCEL_GIT_REPO_SLUG') : ''))
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '').replace(/\.git$/, '').replace(/^\/+|\/+$/g, '');
  const token = env('GITHUB_TOKEN', 'GH_TOKEN', 'GITHUB_PAT'), branch = env('GITHUB_BRANCH', 'VERCEL_GIT_COMMIT_REF') || 'main';
  if (!repo || !token) return res.status(400).json({ message: 'Vercel mein yeh set nahi hain: ' + [!repo && 'GITHUB_REPO', !token && 'GITHUB_TOKEN'].filter(Boolean).join(', ') + '. Environment Variables mein naam bilkul aise likhein, Production par tick karein, Save karein aur phir Redeploy karein.', notConfigured: true });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const path = String(b.path || '');
    if (!/^(products\.js|store-config\.js|images\/[A-Za-z0-9._-]{1,120})$/.test(path)) return res.status(400).json({ message: 'Path not allowed' });
    const put = b.method === 'PUT', api = process.env.GITHUB_API || 'https://api.github.com';
    const r = await fetch(`${api}/repos/${repo}/contents/${path}` + (put ? '' : '?ref=' + encodeURIComponent(branch)), {
      method: put ? 'PUT' : 'GET',
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'jasbaan-admin', 'Content-Type': 'application/json' },
      body: put ? JSON.stringify({ message: String(b.body && b.body.message || 'Update ' + path).slice(0, 200), content: b.body && b.body.content, ...(b.body && b.body.sha ? { sha: b.body.sha } : {}), branch }) : undefined });
    const j = await r.json().catch(() => ({}));
    return res.status(r.status).json(j);
  } catch (e) { console.error(e.message); return res.status(500).json({ message: 'Server error: ' + e.message }); }
};
