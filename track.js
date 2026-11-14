// POST /api/track : a customer looks up or cancels their own order.
//   {action:'track',  id, phone}
//   {action:'cancel', id, phone, reason}   (only while the order is New or Confirmed)
// The order number AND the phone number used on the order must match. Address and phone are never sent back.
const { redis } = require('./_redis');
const s = (v, n = 300) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const last10 = p => String(p || '').replace(/\D/g, '').slice(-10);
const CANCELLABLE = ['New', 'Confirmed'];
const view = o => ({ id: o.id, date: o.date, status: o.status, history: Array.isArray(o.history) ? o.history : [{ s: o.status, at: o.date }],
  items: (o.items || []).map(i => ({ name: i.name, qty: i.qty, price: i.price })), fee: o.fee, total: o.total, pay: o.pay, paid: o.paid || 'Unpaid',
  courier: o.courier || '', track: o.track || '', canCancel: CANCELLABLE.includes(o.status) });
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const id = s(b.id, 40).toUpperCase(), phone = last10(b.phone);
    if (!/^[A-Za-z0-9-]{3,40}$/.test(id) || phone.length < 10) return res.status(400).json({ ok: false, error: 'Please enter your order number and the phone number used for the order.' });
    const ip = s((req.headers['x-forwarded-for'] || '').split(',')[0], 45) || 'x';
    const [, n] = await redis([['SET', 'rt:' + ip, '0', 'EX', '600', 'NX'], ['INCR', 'rt:' + ip]]);
    if (n > 30) return res.status(429).json({ ok: false, error: 'Too many attempts. Please try again in a few minutes.' });
    const [raw] = await redis([['GET', 'order:' + id]]);
    const o = raw ? JSON.parse(raw) : null;
    if (!o || last10(o.phone) !== phone) return res.status(404).json({ ok: false, error: 'We could not find an order with these details. Please check the order number and phone number.' });
    if (b.action === 'cancel') {
      if (!CANCELLABLE.includes(o.status)) return res.status(409).json({ ok: false, error: 'This order can no longer be cancelled here. Please contact us on WhatsApp.' });
      const now = new Date().toISOString(), why = s(b.reason, 120);
      o.status = 'Cancelled';
      o.history = (Array.isArray(o.history) ? o.history : []).concat({ s: 'Cancelled', at: now }).slice(-30);
      o.note = s((o.note ? o.note + ' | ' : '') + 'Cancelled by customer' + (why ? ': ' + why : ''), 500);
      await redis([['SET', 'order:' + id, JSON.stringify(o)]]);
    }
    return res.status(200).json({ ok: true, order: view(o) });
  } catch (e) { console.error(e.message); return res.status(500).json({ ok: false, error: 'Server error. Please try again.' }); }
};
