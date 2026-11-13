// POST /api/order : a customer places an order on the website.
const { redis } = require('./_redis');
const s = (v, n = 300) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (b.hp) return res.status(200).json({ ok: true });   // bot trap
    const items = (Array.isArray(b.items) ? b.items : []).slice(0, 40).map(i => ({ id: s(i.id, 60), name: s(i.name, 80),
      qty: Math.min(20, Math.max(1, parseInt(i.qty, 10) || 1)), price: Math.max(0, Number(i.price) || 0) }));
    const o = { id: s(b.id, 40), date: new Date().toISOString(), status: 'New', name: s(b.name, 80), phone: s(b.phone, 20), city: s(b.city, 60),
      addr: s(b.addr), pay: s(b.pay, 40), items, subtotal: Number(b.subtotal) || 0, fee: Number(b.fee) || 0, total: Number(b.total) || 0,
      source: s(b.source), device: s(b.device), tid: s(b.tid, 40), paid: b.paid === 'Pending' ? 'Pending' : 'Unpaid' };
    if (!o.id || !o.name || !/^[0-9+ ]{10,15}$/.test(o.phone) || !o.addr || !o.city || !items.length) return res.status(400).json({ ok: false, error: 'Invalid order' });
    const ip = s((req.headers['x-forwarded-for'] || '').split(',')[0], 45) || 'x';
    const [n] = await redis([['INCR', 'rl:' + ip], ['EXPIRE', 'rl:' + ip, 600]]);
    if (n > 15) return res.status(429).json({ ok: false, error: 'Too many orders, try later' });
    const [saved] = await redis([['SET', 'order:' + o.id, JSON.stringify(o), 'NX']]);
    if (saved === 'OK') await redis([['LPUSH', 'orders', o.id]]);
    return res.status(200).json({ ok: true, id: o.id });
  } catch (e) { console.error(e.message); return res.status(500).json({ ok: false, error: 'Server error' }); }
};
