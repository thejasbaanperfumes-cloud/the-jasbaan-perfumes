// GET  /api/admin?action=list|status|paid  (header x-admin-key must equal env ADMIN_KEY)
// POST /api/admin  JSON {action:'update'|'delete'|'add', ...}  (same header)
const crypto = require('crypto');
const { redis } = require('./_redis');
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const s = (v, n = 300) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const STATUS = ['New', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], PAID = ['Unpaid', 'Pending', 'Paid'];
const setStatus = (o, st) => { if (o.status !== st) { o.status = st; o.history = (Array.isArray(o.history) ? o.history : []).concat({ s: st, at: new Date().toISOString() }).slice(-30); } };
module.exports = async (req, res) => {
  if (!process.env.ADMIN_KEY || !same(req.headers['x-admin-key'] || '', process.env.ADMIN_KEY)) return res.status(401).json({ ok: false, error: 'Wrong key' });
  const post = req.method === 'POST';
  let b = {};
  try { if (post) b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch (e) { return res.status(400).json({ ok: false, error: 'Bad request' }); }
  const q = post ? b : (req.query || {});
  try {
    if (q.action === 'add') {                                     // manual order (WhatsApp / Instagram / phone)
      const x = b.order || {};
      const items = (Array.isArray(x.items) ? x.items : []).slice(0, 40).map(i => ({ id: s(i.id, 60), name: s(i.name, 80),
        qty: Math.min(99, Math.max(1, parseInt(i.qty, 10) || 1)), price: Math.max(0, Number(i.price) || 0) })).filter(i => i.name);
      const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0), fee = Math.min(100000, Math.max(0, Number(x.fee) || 0));
      const now = new Date().toISOString(), st = STATUS.includes(x.status) ? x.status : 'New';
      const o = { id: 'JB-' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase(), date: now, status: st,
        name: s(x.name, 80), phone: s(x.phone, 20), city: s(x.city, 60), addr: s(x.addr), pay: s(x.pay, 40) || 'Cash on Delivery', items, subtotal, fee, total: subtotal + fee,
        source: s(x.source) || 'Manual order', device: 'Admin panel', tid: s(x.tid, 40), paid: PAID.includes(x.paid) ? x.paid : 'Unpaid',
        courier: s(x.courier, 40), track: s(x.track, 60), note: s(x.note, 500), history: [{ s: st, at: now }] };
      if (!o.name || !/^[0-9+ ]{10,15}$/.test(o.phone) || !o.addr || !o.city || !items.length) return res.status(400).json({ ok: false, error: 'Name, phone (10-15 digits), address, city aur kam az kam ek item zaroori hai' });
      await redis([['SET', 'order:' + o.id, JSON.stringify(o)], ['LPUSH', 'orders', o.id]]);
      return res.status(200).json({ ok: true, id: o.id });
    }
    if (q.action === 'status' || q.action === 'paid' || q.action === 'update' || q.action === 'delete') {
      const id = String(q.id || ''), [raw] = await redis([['GET', 'order:' + id]]);
      if (!raw) return res.status(404).json({ ok: false, error: 'Order not found' });
      if (q.action === 'delete') { await redis([['DEL', 'order:' + id], ['LREM', 'orders', '0', id]]); return res.status(200).json({ ok: true }); }
      const o = JSON.parse(raw);
      if (q.action === 'status' && STATUS.includes(q.status)) setStatus(o, q.status);
      else if (q.action === 'paid' && PAID.includes(q.paid)) o.paid = q.paid;
      else if (q.action === 'update') { o.courier = s(q.courier, 40); o.track = s(q.track, 60); o.note = s(q.note, 500); }
      else return res.status(400).json({ ok: false, error: 'Bad value' });
      await redis([['SET', 'order:' + id, JSON.stringify(o)]]);
      return res.status(200).json({ ok: true });
    }
    const lim = Math.min(1000, Math.max(1, parseInt(q.limit, 10) || 500));
    const [ids, count] = await redis([['LRANGE', 'orders', '0', String(lim - 1)], ['LLEN', 'orders']]);
    const rows = ids.length ? (await redis([['MGET', ...ids.map(i => 'order:' + i)]]))[0] : [];
    return res.status(200).json({ ok: true, count, orders: rows.filter(Boolean).map(r => JSON.parse(r)) });
  } catch (e) { console.error(e.message); return res.status(500).json({ ok: false, error: 'Server error' }); }
};
