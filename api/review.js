// POST /api/review : a customer sends a review (with up to 3 photos). It waits as "Pending" until you approve it in admin.
const crypto = require('crypto');
const { redis } = require('./_redis');
const s = (v, n = 300) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (b.hp) return res.status(200).json({ ok: true });                       // bot trap
    const name = s(b.name, 60), city = s(b.city, 60), product = s(b.product, 60), text = s(b.text, 600), rating = parseInt(b.rating, 10);
    if (name.length < 2 || text.length < 10 || !(rating >= 1 && rating <= 5)) return res.status(400).json({ ok: false, error: 'Please add your name, a star rating and a review of at least 10 letters.' });
    const photos = [];
    let total = 0;
    for (const d of (Array.isArray(b.photos) ? b.photos : []).slice(0, 3)) {
      const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(d || ''));
      if (!m || m[1].length > 260000 || Buffer.from(m[1].slice(0, 8), 'base64')[0] !== 0xff) return res.status(400).json({ ok: false, error: 'Photo could not be read. Please choose a JPG or PNG photo.' });
      total += m[1].length; photos.push(m[1]);
    }
    if (total > 650000) return res.status(400).json({ ok: false, error: 'Photos are too large. Please choose smaller photos.' });
    const ip = s((req.headers['x-forwarded-for'] || '').split(',')[0], 45) || 'x';
    const [, n] = await redis([['SET', 'rv:' + ip, '0', 'EX', '3600', 'NX'], ['INCR', 'rv:' + ip]]);
    if (n > 5) return res.status(429).json({ ok: false, error: 'Too many reviews from this connection. Please try again later.' });
    const id = crypto.randomBytes(8).toString('hex');
    const r = { id, date: new Date().toISOString(), name, city, product, rating, text, photos: photos.length, status: 'Pending' };
    await redis([['SET', 'review:' + id, JSON.stringify(r)], ...photos.map((p, i) => ['SET', 'rphoto:' + id + ':' + i, p]), ['LPUSH', 'reviews', id]]);
    return res.status(200).json({ ok: true });
  } catch (e) { console.error(e.message); return res.status(500).json({ ok: false, error: 'Server error. Please try again.' }); }
};
