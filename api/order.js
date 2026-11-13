// POST /api/order : a customer places an order on the website.
const { redis } = require('./_redis');
const { products, config } = require('./_catalog');
const s = (v, n = 300) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (b.hp) return res.status(200).json({ ok: true });   // bot trap
    let items = (Array.isArray(b.items) ? b.items : []).slice(0, 40).map(i => ({ id: s(i.id, 60), name: s(i.name, 80),
      qty: Math.min(20, Math.max(1, parseInt(i.qty, 10) || 1)), price: Math.max(0, Number(i.price) || 0) }));
    let pay = s(b.pay, 40), fee = Math.min(5000, Math.max(0, Number(b.fee) || 0)), paid = b.paid === 'Pending' ? 'Pending' : 'Unpaid';
    // Prices, delivery fee and payment method are taken from the site's own files, never from the browser.
    const [cat, cfg] = await Promise.all([products(req), config(req)]);
    if (Array.isArray(cat)) {
      items = items.map(i => { const p = cat.find(x => x.id === i.id); return p && p.price != null ? { id: p.id, name: s(p.name, 80), qty: i.qty, price: Number(p.sale || p.price) } : null; });
      if (items.some(i => !i)) return res.status(400).json({ ok: false, error: 'An item in your bag is no longer available. Please refresh the page.' });
    }
    if (cfg && typeof cfg === 'object') {
      fee = Math.max(0, Number(cfg.deliveryFee) || 0);
      const m = pay === 'Cash on Delivery' ? { type: 'cod' } : (cfg.payments || []).find(x => x.label === pay);
      if (!m) return res.status(400).json({ ok: false, error: 'Payment method not available' });
      paid = m.type && m.type !== 'cod' ? 'Pending' : 'Unpaid';
    }
    const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
    const o = { id: s(b.id, 40), date: new Date().toISOString(), status: 'New', name: s(b.name, 80), phone: s(b.phone, 20), city: s(b.city, 60),
      addr: s(b.addr), pay, items, subtotal, fee, total: subtotal + fee,
      source: s(b.source), device: s(b.device), tid: s(b.tid, 40), paid, courier: '', track: '', note: '' };
    o.history = [{ s: 'New', at: o.date }];
    if (!/^[A-Za-z0-9-]{3,40}$/.test(o.id) || !o.name || !/^[0-9+ ]{10,15}$/.test(o.phone) || !o.addr || !o.city || !items.length) return res.status(400).json({ ok: false, error: 'Invalid order' });
    if (paid === 'Pending' && !o.tid) return res.status(400).json({ ok: false, error: 'Transaction ID is required' });
    const ip = s((req.headers['x-forwarded-for'] || '').split(',')[0], 45) || 'x';
    const [, n] = await redis([['SET', 'rl:' + ip, '0', 'EX', '600', 'NX'], ['INCR', 'rl:' + ip]]);
    if (n > 15) return res.status(429).json({ ok: false, error: 'Too many orders, try later' });
    const [saved] = await redis([['SET', 'order:' + o.id, JSON.stringify(o), 'NX']]);
    if (saved === 'OK') await redis([['LPUSH', 'orders', o.id]]);
    return res.status(200).json({ ok: true, id: o.id });
  } catch (e) { console.error(e.message); return res.status(500).json({ ok: false, error: 'Server error' }); }
};
