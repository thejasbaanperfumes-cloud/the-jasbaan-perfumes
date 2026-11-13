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

function doPost(e) {                       // new order from the website
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const o = JSON.parse(e.postData.contents);
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

function doGet(e) {                        // admin: list orders / change status / courier / note / add / delete
  const p = e.parameter;
  if (ADMIN_KEY === 'CHANGE-THIS-SECRET' || p.key !== ADMIN_KEY) return out({ ok: false, error: 'Wrong key' });
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const t = T(); if (t.getLastColumn() < HEAD.length) t.getRange(1, 1, 1, HEAD.length).setValues([HEAD]);
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
