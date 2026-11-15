// GET /api/review-photo?id=...&n=0 : one review photo (JPEG).
const { redis } = require('./_redis');
module.exports = async (req, res) => {
  const q = req.query || {}, id = String(q.id || ''), n = parseInt(q.n, 10);
  if (!/^[a-f0-9]{16}$/.test(id) || !(n >= 0 && n <= 2)) return res.status(404).end('Not found');
  try {
    const [b64] = await redis([['GET', 'rphoto:' + id + ':' + n]]);
    if (!b64) return res.status(404).end('Not found');
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).end(Buffer.from(b64, 'base64'));
  } catch (e) { console.error(e.message); return res.status(500).end('Error'); }
};
