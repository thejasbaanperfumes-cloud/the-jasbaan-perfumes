// GET /api/admin?action=list|status|paid  (header x-admin-key must equal env ADMIN_KEY)
const crypto = require('crypto');
const { redis } = require('./_redis');
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
module.exports = async (req, res) => {
  if (!process.env.ADMIN_KEY || !same(req.headers['x-admin-key'] || '', process.env.ADMIN_KEY)) return res.status(401).json({ ok: false, error: 'Wrong key' });
  const q = req.query || {};
  try {
    if (q.action === 'status' || q.action === 'paid') {
      const id = String(q.id || ''), [raw] = await redis([['GET', 'order:' + id]]);
      if (!raw) return res.status(404).json({ ok: false, error: 'Order not found' });
      const o = JSON.parse(raw);
      if (q.action === 'status' && ['New', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(q.status)) o.status = q.status;
      else if (q.action === 'paid' && ['Unpaid', 'Pending', 'Paid'].includes(q.paid)) o.paid = q.paid;
      else return res.status(400).json({ ok: false, error: 'Bad value' });
      await redis([['SET', 'order:' + id, JSON.stringify(o)]]);
      return res.status(200).json({ ok: true });
    }
    const [ids] = await redis([['LRANGE', 'orders', '0', '499']]);
    const rows = ids.length ? (await redis([['MGET', ...ids.map(i => 'order:' + i)]]))[0] : [];
    return res.status(200).json({ ok: true, orders: rows.filter(Boolean).map(r => JSON.parse(r)) });
  } catch (e) { console.error(e.message); return res.status(500).json({ ok: false, error: 'Server error' }); }
};
