// Reads the live product list and store settings from the site itself (products.js, store-config.js),
// so the server can work out prices instead of trusting the browser. Returns null if it cannot be read.
const cache = {};
const siteHost = req => process.env.SITE_URL ? String(process.env.SITE_URL).replace(/^https?:\/\//, '').replace(/\/+$/, '')
  : process.env.VERCEL ? ((process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL) || process.env.VERCEL_URL || req.headers.host)
  : req.headers.host;
const grab = async (req, file, open, close) => {
  const c = cache[file]; if (c && Date.now() - c.t < 30000) return c.v;
  const host = String(siteHost(req) || '').trim(); if (!host) return null;
  const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 4000);
  try {
    const r = await fetch((/^(localhost|127\.)/.test(host) ? 'http://' : 'https://') + host + '/' + file, { signal: ctl.signal });
    if (!r.ok) return null;
    const t = await r.text();
    const v = JSON.parse(t.slice(t.indexOf(open), t.lastIndexOf(close) + 1));
    cache[file] = { t: Date.now(), v }; return v;
  } catch (e) { return null; } finally { clearTimeout(tm); }
};
exports.products = req => grab(req, 'products.js', '[', ']');
exports.config = req => grab(req, 'store-config.js', '{', '}');
