// GET /api/reviews : approved customer reviews for the website (newest first).
const { redis } = require('./_redis');
module.exports = async (req, res) => {
  try {
    const [ids] = await redis([['LRANGE', 'reviews', '0', '99']]);
    const rows = ids.length ? (await redis([['MGET', ...ids.map(i => 'review:' + i)]]))[0] : [];
    const out = rows.filter(Boolean).map(r => JSON.parse(r)).filter(r => r.status === 'Approved').slice(0, 30)
      .map(r => ({ id: r.id, name: r.name, city: r.city, product: r.product, rating: r.rating, text: r.text, date: r.date,
        photos: Array.from({ length: r.photos || 0 }, (_, i) => '/api/review-photo?id=' + r.id + '&n=' + i) }));
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30');
    return res.status(200).json({ ok: true, reviews: out });
  } catch (e) { console.error(e.message); return res.status(500).json({ ok: false, reviews: [] }); }
};
