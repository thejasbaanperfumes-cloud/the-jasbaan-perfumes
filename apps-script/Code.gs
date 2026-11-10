// Jasbaan orders backend. Paste into Google Sheet > Extensions > Apps Script.
const ADMIN_KEY = 'CHANGE-THIS-SECRET';   // choose a long secret, use the same one in admin.html Settings
const HEAD = ['id','date','status','name','phone','city','addr','pay','items','subtotal','fee','total','source','device'];
const T = () => { const ss = SpreadsheetApp.getActiveSpreadsheet(); let t = ss.getSheetByName('Orders');
  if (!t) { t = ss.insertSheet('Orders'); t.appendRow(HEAD); t.setFrozenRows(1); t.getRange('A:N').setNumberFormat('@'); } return t; };
const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const c = (v, n) => String(v == null ? '' : v).slice(0, n || 300);

function doPost(e) {                       // new order from the website
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const o = JSON.parse(e.postData.contents);
    if (o.hp || !o.id || !o.name || !o.phone || !Array.isArray(o.items)) return out({ ok: false });
    const t = T();
    if (t.createTextFinder(c(o.id, 40)).matchEntireCell(true).findNext()) return out({ ok: true });
    t.appendRow([c(o.id, 40), new Date().toISOString(), 'New', c(o.name, 80), c(o.phone, 20), c(o.city, 60), c(o.addr),
      c(o.pay, 40), JSON.stringify(o.items.slice(0, 40)), c(o.subtotal, 12), c(o.fee, 12), c(o.total, 12), c(o.source), c(o.device)]);
    return out({ ok: true });
  } finally { lock.releaseLock(); }
}

function doGet(e) {                        // admin: list orders / change status
  const p = e.parameter;
  if (p.key !== ADMIN_KEY) return out({ ok: false, error: 'Wrong key' });
  const t = T(), v = t.getDataRange().getValues();
  if (p.action === 'status') {
    for (let i = 1; i < v.length; i++) if (v[i][0] === p.id) { t.getRange(i + 1, 3).setValue(c(p.status, 20)); return out({ ok: true }); }
    return out({ ok: false, error: 'Order not found' });
  }
  const orders = v.slice(1).map(r => { const o = {}; HEAD.forEach((k, i) => o[k] = r[i]);
    try { o.items = JSON.parse(o.items); } catch (x) { o.items = []; } return o; }).reverse();
  return out({ ok: true, orders });
}
