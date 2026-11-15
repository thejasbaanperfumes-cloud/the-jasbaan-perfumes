// Jasbaan orders backend. Paste into Google Sheet > Extensions > Apps Script.
const ADMIN_KEY = 'CHANGE-THIS-SECRET';   // choose a long secret, use the same one in admin.html Settings
const HEAD = ['id','date','status','name','phone','city','addr','pay','items','subtotal','fee','total','source','device','tid','paid','courier','track','note','history'];
const STATUS = ['New', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], PAID = ['Unpaid', 'Pending', 'Paid'];
const T = () => { const ss = SpreadsheetApp.getActiveSpreadsheet(); let t = ss.getSheetByName('Orders');
  if (!t) { t = ss.insertSheet('Orders'); t.appendRow(HEAD); t.setFrozenRows(1); t.getRange('A:T').setNumberFormat('@'); } return t; };
const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const c = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, n || 300);
const col = k => HEAD.indexOf(k) + 1;
const num = v => Math.max(0, Number(v) || 0);
const cleanItems = (a, maxQty) => (Array.isArray(a) ? a : []).slice(0, 40).map(i => ({ id: c(i.id, 60), name: c(i.name, 80),
  qty: Math.min(maxQty, Math.max(1, parseInt(i.qty, 10) || 1)), price: num(i.price) })).filter(i => i.name);
const newId = () => 'JB-' + Date.now().toString(36).toUpperCase() + Math.random().toString(16).slice(2, 6).toUpperCase();
const RHEAD = ['id','date','name','city','product','rating','text','photos','status'];
const RT = () => { const ss = SpreadsheetApp.getActiveSpreadsheet(); let t = ss.getSheetByName('Reviews');
  if (!t) { t = ss.insertSheet('Reviews'); t.appendRow(RHEAD); t.setFrozenRows(1); t.getRange('A:I').setNumberFormat('@'); } return t; };
const rvRows = () => { const v = RT().getDataRange().getValues(); return v.slice(1).map((r, k) => { const o = { _row: k + 2 }; RHEAD.forEach((h, i) => o[h] = r[i] == null ? '' : r[i]);
  let ph = []; try { ph = JSON.parse(o.photos || '[]'); } catch (x) {} o.photoIds = ph; o.photos = ph.map(f => 'https://lh3.googleusercontent.com/d/' + f); o.rating = Number(o.rating) || 0; return o; }); };
function saveReview(o) {                   // customer review with up to 3 photos (photos go to a Drive folder)
  const name = c(o.name, 60), text = c(o.text, 600), rating = parseInt(o.rating, 10), cache = CacheService.getScriptCache(), cnt = Number(cache.get('rvn') || 0);
  if (cnt >= 20) return out({ ok: false, error: 'Too many reviews right now. Please try again later.' });
  if (name.length < 2 || text.length < 10 || !(rating >= 1 && rating <= 5)) return out({ ok: false, error: 'Please add your name, a star rating and a review of at least 10 letters.' });
  const id = Utilities.getUuid().replace(/-/g, '').slice(0, 16), ids = []; let total = 0;
  const photos = (Array.isArray(o.photos) ? o.photos : []).slice(0, 3);
  if (photos.length) {
    const fs = DriveApp.getFoldersByName('Jasbaan Review Photos'), folder = fs.hasNext() ? fs.next() : DriveApp.createFolder('Jasbaan Review Photos');
    photos.forEach((d, k) => { const m = /^data:image\/jpeg;base64,([A-Za-z0-9+\/=]+)$/.exec(String(d || '')); total += m ? m[1].length : 0;
      if (!m || m[1].length > 260000 || total > 650000) return;
      const f = folder.createFile(Utilities.newBlob(Utilities.base64Decode(m[1]), 'image/jpeg', id + '-' + k + '.jpg'));
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); ids.push(f.getId()); });
  }
  RT().appendRow([id, new Date().toISOString(), name, c(o.city, 60), c(o.product, 60), rating, text, JSON.stringify(ids), 'Pending']);
  cache.put('rvn', String(cnt + 1), 3600);
  return out({ ok: true });
}

function doPost(e) {                       // new order from the website
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const o = JSON.parse(e.postData.contents);
    if (o.action === 'review') return o.hp ? out({ ok: true }) : saveReview(o);
    if (o.hp || !/^[A-Za-z0-9-]{3,40}$/.test(String(o.id)) || !o.name || !o.phone || !Array.isArray(o.items)) return out({ ok: false });
    const t = T();
    if (t.createTextFinder(c(o.id, 40)).matchEntireCell(true).findNext()) return out({ ok: true });
    const items = cleanItems(o.items, 20), subtotal = items.reduce((a, i) => a + i.price * i.qty, 0), fee = Math.min(5000, num(o.fee)), now = new Date().toISOString();
    t.appendRow([c(o.id, 40), now, 'New', c(o.name, 80), c(o.phone, 20), c(o.city, 60), c(o.addr),
      c(o.pay, 40), JSON.stringify(items), subtotal, fee, subtotal + fee, c(o.source), c(o.device), c(o.tid, 40), c(o.paid, 20), '', '', '',
      JSON.stringify([{ s: 'New', at: now }])]);
    return out({ ok: true });
  } finally { lock.releaseLock(); }
}

const last10 = v => String(v || '').replace(/\D/g, '').slice(-10);
function trackOrder(p) {                   // customer: look up or cancel their own order (order number + phone must match)
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const id = c(p.id, 40).toUpperCase(), ph = last10(p.phone), cache = CacheService.getScriptCache(), fk = 'tf:' + id;
    if (!/^[A-Za-z0-9-]{3,40}$/.test(id) || ph.length < 10) return out({ ok: false, error: 'Please enter your order number and the phone number used for the order.' });
    if (Number(cache.get(fk) || 0) >= 8) return out({ ok: false, error: 'Too many attempts. Please try again in a few minutes.' });
    const t = T(), v = t.getDataRange().getValues(); let row = 0;
    for (let i = 1; i < v.length; i++) if (String(v[i][0]).toUpperCase() === id && last10(v[i][col('phone') - 1]) === ph) { row = i + 1; break; }
    if (!row) { cache.put(fk, String(Number(cache.get(fk) || 0) + 1), 600); return out({ ok: false, error: 'We could not find an order with these details. Please check the order number and phone number.' }); }
    const r = v[row - 1], get = k => r[col(k) - 1]; let st = get('status'), hist = [], note = get('note');
    try { hist = JSON.parse(get('history') || '[]'); } catch (x) {}
    if (p.action === 'cancel') {
      if (['New', 'Confirmed'].indexOf(st) < 0) return out({ ok: false, error: 'This order can no longer be cancelled here. Please contact us on WhatsApp.' });
      const why = c(p.reason, 120); st = 'Cancelled'; hist.push({ s: st, at: new Date().toISOString() }); hist = hist.slice(-30);
      note = c((note ? note + ' | ' : '') + 'Cancelled by customer' + (why ? ': ' + why : ''), 500);
      t.getRange(row, col('status')).setValue(st); t.getRange(row, col('history')).setValue(JSON.stringify(hist)); t.getRange(row, col('note')).setValue(note);
    }
    let items = []; try { items = JSON.parse(get('items')); } catch (x) {}
    if (!hist.length) hist = [{ s: st, at: get('date') }];
    return out({ ok: true, order: { id: String(get('id')), date: get('date'), status: st, history: hist,
      items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })), fee: Number(get('fee')) || 0, total: Number(get('total')) || 0, pay: get('pay'), paid: get('paid') || 'Unpaid',
      courier: get('courier') || '', track: get('track') || '', canCancel: ['New', 'Confirmed'].indexOf(st) >= 0 } });
  } finally { lock.releaseLock(); }
}

function doGet(e) {                        // customer: track / cancel (no key). admin: list / status / courier / note / add / delete (key)
  const p = e.parameter;
  if (p.action === 'track' || p.action === 'cancel') return trackOrder(p);
  if (p.action === 'reviews') return out({ ok: true, reviews: rvRows().filter(r => r.status === 'Approved').reverse().slice(0, 30)
    .map(r => ({ id: r.id, name: r.name, city: r.city, product: r.product, rating: r.rating, text: r.text, date: r.date, photos: r.photos })) });
  if (ADMIN_KEY === 'CHANGE-THIS-SECRET' || p.key !== ADMIN_KEY) return out({ ok: false, error: 'Wrong key' });
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const t = T(); if (t.getLastColumn() < HEAD.length) t.getRange(1, 1, 1, HEAD.length).setValues([HEAD]);
    if (p.action === 'rlist') return out({ ok: true, reviews: rvRows().reverse().map(r => ({ id: r.id, date: r.date, name: r.name, city: r.city, product: r.product, rating: r.rating, text: r.text, photos: r.photos, status: r.status })) });
    if (p.action === 'rset' || p.action === 'rdel') {
      const r = rvRows().filter(x => String(x.id) === String(p.id))[0]; if (!r) return out({ ok: false, error: 'Review not found' });
      if (p.action === 'rdel') { r.photoIds.forEach(f => { try { DriveApp.getFileById(f).setTrashed(true); } catch (x) {} }); RT().deleteRow(r._row); return out({ ok: true }); }
      if (['Pending', 'Approved', 'Hidden'].indexOf(p.status) < 0) return out({ ok: false, error: 'Bad value' });
      RT().getRange(r._row, RHEAD.indexOf('status') + 1).setValue(p.status); return out({ ok: true });
    }
    if (p.action === 'add') {
      let x; try { x = JSON.parse(p.data); } catch (er) { return out({ ok: false, error: 'Bad data' }); }
      const items = cleanItems(x.items, 99), subtotal = items.reduce((a, i) => a + i.price * i.qty, 0), fee = Math.min(100000, num(x.fee)), now = new Date().toISOString(), id = newId();
      const st = STATUS.indexOf(x.status) >= 0 ? x.status : 'New';
      if (!x.name || !/^[0-9+ ]{10,15}$/.test(String(x.phone)) || !x.addr || !x.city || !items.length) return out({ ok: false, error: 'Name, phone (10-15 digits), address, city aur kam az kam ek item zaroori hai' });
      t.appendRow([id, now, st, c(x.name, 80), c(x.phone, 20), c(x.city, 60), c(x.addr), c(x.pay, 40) || 'Cash on Delivery', JSON.stringify(items), subtotal, fee, subtotal + fee,
        c(x.source) || 'Manual order', 'Admin panel', c(x.tid, 40), PAID.indexOf(x.paid) >= 0 ? x.paid : 'Unpaid', c(x.courier, 40), c(x.track, 60), c(x.note, 500), JSON.stringify([{ s: st, at: now }])]);
      return out({ ok: true, id });
    }
    const v = t.getDataRange().getValues();
    if (['status', 'paid', 'update', 'delete'].indexOf(p.action) >= 0) {
      let row = 0; for (let i = 1; i < v.length; i++) if (String(v[i][0]) === String(p.id)) { row = i + 1; break; }
      if (!row) return out({ ok: false, error: 'Order not found' });
      if (p.action === 'delete') { t.deleteRow(row); return out({ ok: true }); }
      if (p.action === 'status') {
        if (STATUS.indexOf(p.status) < 0) return out({ ok: false, error: 'Bad value' });
        if (v[row - 1][col('status') - 1] !== p.status) {
          let h = []; try { h = JSON.parse(v[row - 1][col('history') - 1] || '[]'); } catch (er) {}
          h.push({ s: p.status, at: new Date().toISOString() });
          t.getRange(row, col('history')).setValue(JSON.stringify(h.slice(-30)));
        }
        t.getRange(row, col('status')).setValue(p.status);
      } else if (p.action === 'paid') {
        if (PAID.indexOf(p.paid) < 0) return out({ ok: false, error: 'Bad value' });
        t.getRange(row, col('paid')).setValue(p.paid);
      } else {
        t.getRange(row, col('courier')).setValue(c(p.courier, 40)); t.getRange(row, col('track')).setValue(c(p.track, 60)); t.getRange(row, col('note')).setValue(c(p.note, 500));
      }
      return out({ ok: true });
    }
    const orders = v.slice(1).map(r => { const o = {}; HEAD.forEach((k, i) => o[k] = r[i] == null ? '' : r[i]);
      try { o.items = JSON.parse(o.items); } catch (x) { o.items = []; }
      try { o.history = JSON.parse(o.history || '[]'); } catch (x) { o.history = []; } return o; }).reverse();
    return out({ ok: true, count: orders.length, orders });
  } finally { lock.releaseLock(); }
}
