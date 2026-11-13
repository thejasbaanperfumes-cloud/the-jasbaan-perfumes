/* THE JASBAAN PERFUME: storefront logic (plain JavaScript, no framework). */

/* ===== EDIT THESE ===== */
const CONFIG = {
  whatsapp: '923712272628',          // country code first, no + or spaces
  currency: 'PKR',
  deliveryFee: 300,                  // PLACEHOLDER: set your real delivery fee
  payments: [{ label: 'Cash on Delivery' }], // add more methods here once you support them
  storeKey: 'jasbaan-cart',
  orderUrl: ''                       // paste your Google Apps Script web app address here to save every order in a Google Sheet (see README)
};

/* Add a product: copy one block, give it a new id, name, price and image in the images folder.
   price is in rupees. Use price: null until the price is confirmed (the page then shows Price on WhatsApp). sale is optional.
   img2 is an optional second photo shown in the details window.
   gender is Men, Women or Unisex and decides where the product appears in the catalogue.
   Product page fields: tagline, points (highlights), lasting, notes, season, occasion. Empty fields are not shown.
   Each product has its own page at index.html#p-<id>, for example index.html#p-nayel.
   notes: add real fragrance notes only when you have confirmed them. */
const PRODUCTS = [
  { id: 'tester-set', name: 'Tester Collection', cat: 'Bundle', gender: 'Unisex', price: 1299, sale: null, notes: '', best: false, tag: 'Launch offer',
    label: 'Tester Collection 5 x 5ml', size: '5 testers × 5 ml', type: 'Perfume testers',
    img: 'images/tester-set.jpg', img2: 'images/tester-set-photo.jpg',
    desc: 'A limited-edition tester collection of five 5 ml testers, for every mood and every moment.',
    tagline: 'One collection. Five signature scents.', points: ['Five 5 ml testers', 'Nayel, Almira, Blue Sea, Gucci Flora, Blue Lady', 'Limited edition'],
    lasting: '', season: '', occasion: '',
    long: 'The Jasbaan Tester Collection is a limited-edition set of five 5 ml perfume testers: Nayel, Almira, Blue Sea, Gucci Flora and Blue Lady. It is an exclusive launch bundle priced at PKR 1,299 for the whole set. Each tester is a small spray bottle with the Jasbaan label, so you can try every fragrance on your skin, find the one that feels like you, and then choose a full bottle. For the best result, spray on clean, moisturised skin at the wrists and neck, and keep the testers away from heat and direct sunlight. To order, add the set to your bag and send your order on WhatsApp, or message us on +92 371 2272628. Delivery areas, timing and charges are confirmed with you when you order, and the checkout offers Cash on Delivery.' },
  { id: 'silver-oud', name: 'Silver Oud', cat: 'Oud', gender: 'Unisex', price: 1699, sale: null, notes: '', best: true,
    img: 'images/silver-oud.jpg', desc: 'Rich oud character with refined elegance. A scent that leaves a legacy. 50 ml eau de parfum.',
    tagline: 'A scent that leaves a legacy.', points: ['Rich oud character', 'Refined elegance', 'Unforgettable presence'],
    lasting: '', season: '', occasion: '' },
  { id: 'blue-sea', name: 'Blue Sea', cat: 'Fresh', gender: 'Men', price: 1499, sale: null, notes: '', best: false,
    img: 'images/blue-sea.jpg', desc: 'Fresh and bold. Make waves and leave an impression. 50 ml eau de parfum.',
    tagline: 'Make waves. Leave an impression.', points: ['Fresh', 'Bold', 'Unforgettable'],
    lasting: '', season: '', occasion: '' },
  { id: 'scent-of-love', name: 'Scent of Love', cat: 'Signature', gender: 'Women', price: 1799, sale: null, notes: '', best: false,
    img: 'images/scent-of-love.jpg', desc: 'A fragrance that leaves a lasting impression. Elegant and feminine. 50 ml eau de parfum.',
    tagline: 'A fragrance that leaves a lasting impression.', points: ['Long lasting fragrance', 'Premium ingredients', 'Elegant and feminine'],
    lasting: 'Long lasting fragrance', season: '', occasion: '' },
  { id: 'gucci-flora', name: 'Gucci Flora', cat: 'Floral', gender: 'Women', price: 1699, sale: null, notes: '', best: true,
    img: 'images/gucci-flora.jpg', desc: 'A timeless fragrance of luxury and elegance, for every special moment. 50 ml eau de parfum.',
    tagline: 'More than a fragrance. It is a feeling.', points: ['Floral essence', 'Long lasting fragrance', 'Premium quality'],
    lasting: 'Long lasting fragrance that stays with you all day', season: '', occasion: '' },
  { id: 'nayel', name: 'Nayel', cat: 'Signature', gender: 'Men', price: 1499, sale: null, notes: '', best: false,
    img: 'images/nayel.jpg', img2: 'images/nayel-photo.jpg', desc: 'A fragrance that leaves a lasting impression. Elegant and masculine. 50 ml eau de parfum.',
    tagline: 'A fragrance that leaves a lasting impression.', points: ['Long lasting fragrance', 'Premium ingredients', 'Elegant and masculine'],
    lasting: 'Long lasting fragrance', season: '', occasion: '' },
  { id: 'admire', name: 'Admire', cat: 'Signature', gender: 'Men', price: 1899, sale: null, notes: '', best: false,
    img: 'images/admire.jpg', img2: 'images/admire-photo.jpg', desc: 'A fragrance that leaves a lasting impression. 50 ml eau de parfum.',
    tagline: 'A fragrance that leaves a lasting impression.', points: ['Long lasting fragrance', 'Premium ingredients'],
    lasting: 'Long lasting fragrance', season: '', occasion: '' },
  { id: 'blue-lady', name: 'Blue Lady', cat: 'Signature', gender: 'Women', price: 1599, sale: null, notes: '', best: false,
    img: 'images/blue-lady.jpg', desc: 'A fragrance that defines you. Elegant, timeless and unforgettable. 50 ml eau de parfum.',
    tagline: 'A fragrance that defines you.', points: ['Long lasting fragrance', 'Premium quality essence', 'For every special moment'],
    lasting: 'Long lasting fragrance', season: '', occasion: '' },
  { id: 'salaar', name: 'Salaar', cat: 'Signature', gender: 'Men', price: null, sale: null, notes: '', best: false,
    img: 'images/salaar.jpg', desc: 'A signature eau de parfum from Jasbaan. 50 ml eau de parfum.',
    tagline: 'Wear confidence.... Wear JASBAAN.', points: ['Signature fragrance', 'Eau de parfum'],
    lasting: '', season: '', occasion: '' },
  { id: 'roma', name: 'Roma', cat: 'Floral', gender: 'Women', price: null, sale: null, notes: '', best: false,
    img: 'images/roma.jpg', desc: 'A floral eau de parfum from Jasbaan. Luxury in every spray. 50 ml eau de parfum.',
    tagline: 'Luxury in every spray.', points: ['Floral fragrance', 'Long lasting', 'Luxury in every spray'],
    lasting: 'Long lasting', season: '', occasion: '' }
];
/* ===== END EDIT ===== */

/* true: every perfume has its own file (blue-sea.html and so on). The online preview sets this to false. */
const MULTI = true;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => CONFIG.currency + ' ' + n.toLocaleString('en-PK');
const eff = p => p.sale || p.price;
const pv = p => eff(p) ?? 1e9;
const waLink = t => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(t);
const priceHTML = p => p.price == null ? 'Price on WhatsApp' : (p.sale ? `<s>${fmt(p.price)}</s>` : '') + fmt(eff(p));
const label = p => p.label || `${p.name} Eau de Parfum 50ml`;
const clean = s => String(s || '').replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, 300);
const buyBtn = (p, cls) => p.price == null
  ? `<a class="btn ${cls}" href="${waLink('Hello Jasbaan, what is the price of ' + p.name + '?')}" target="_blank" rel="noopener noreferrer">Ask price</a>`
  : `<button class="btn ${cls}" data-a="${p.id}">Add to Cart</button>`;

/* Ads: add a video by copying a line. product is the perfume id (blue-sea, admire and so on), or '' for an ad that
   belongs to no perfume page. Set wide: true for landscape videos. */
const ADS = [
  { src: 'videos/ads/blue-sea-1.mp4', poster: 'images/ads/blue-sea-1.jpg', product: 'blue-sea', label: 'Blue Sea', wide: false },
  { src: 'videos/ads/blue-sea-2.mp4', poster: 'images/ads/blue-sea-2.jpg', product: 'blue-sea', label: 'Blue Sea', wide: true },
  { src: 'videos/ads/blue-sea-3.mp4', poster: 'images/ads/blue-sea-3.jpg', product: 'blue-sea', label: 'Blue Sea', wide: false },
  { src: 'videos/ads/blue-sea-4.mp4', poster: 'images/ads/blue-sea-4.jpg', product: 'blue-sea', label: 'Blue Sea', wide: false },
  { src: 'videos/ads/admire-1.mp4',   poster: 'images/ads/admire-1.jpg',   product: 'admire',   label: 'Admire',   wide: true },
  { src: 'videos/ads/salaar-1.mp4',   poster: 'images/ads/salaar-1.jpg',   product: 'salaar',         label: 'Salaar',   wide: true },
  { src: 'videos/ads/salaar-2.mp4',   poster: 'images/ads/salaar-2.jpg',   product: 'salaar',         label: 'Salaar',   wide: true },
  { src: 'videos/ads/roma-1.mp4',     poster: 'images/ads/roma-1.jpg',     product: 'roma',         label: 'Roma',     wide: false }
];
const adHTML = (a, link) => `<figure class="vf${a.wide ? ' wide' : ''}"><video controls playsinline preload="none" poster="${a.poster}" src="${a.src}" aria-label="${a.label} ad video"></video>
  <figcaption>${a.label} ad${link && a.product ? ` · <a href="${MULTI ? a.product + '.html' : '#p-' + a.product}">View ${a.label}</a>` : ''}</figcaption></figure>`;
const adsFor = p => {
  const L = ADS.filter(a => a.product === p.id);
  return L.length ? `<h3>Watch the ${p.name} ad</h3><div class="vgrid">${L.map(a => adHTML(a, false)).join('')}</div>` : '';
};

let cart = [], cat = 'All', gen = 'All', sort = '', term = '';
try {
  const saved = JSON.parse(localStorage.getItem(CONFIG.storeKey));
  cart = (Array.isArray(saved) ? saved : []).filter(i => i && PRODUCTS.some(p => p.id === i.id && p.price != null))
    .map(i => ({ id: i.id, q: Math.min(20, Math.max(1, parseInt(i.q, 10) || 1)) }));
} catch (e) {}
const save = () => { try { localStorage.setItem(CONFIG.storeKey, JSON.stringify(cart)); } catch (e) {} };

/* Toast notifications */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 3200);
}

/* Scroll animations */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); setTimeout(() => { e.target.style.transitionDelay = ''; e.target.classList.add('done'); }, 1500); } }), { threshold: .12 })
  : null;
const reveal = () => $$('.sr:not(.in)').forEach((el, i) => {
  if (!io) return el.classList.add('in');
  if (el.classList.contains('card')) el.style.transitionDelay = (i % 4) * 100 + 'ms'; // staggered entrance
  io.observe(el);
});

/* Product grid: category filter, search, sort by price */
const card = p => `<article class="card sr">
  ${p.tag ? `<span class="tag">${p.tag}</span>` : p.best ? '<span class="tag">Featured</span>' : ''}
  <button class="pimg" data-d="${p.id}" aria-label="View ${p.name} details"><img src="${p.img}" alt="${label(p)} by Jasbaan Perfume Pakistan" loading="lazy"></button>
  <div class="pb"><small>${p.gender} · ${p.cat}</small><h3>${p.name}</h3>${p.notes ? `<p class="nt">${p.notes}</p>` : ''}
  <p class="pr">${priceHTML(p)}</p>
  <div class="pa"><button class="btn ghost sm" data-d="${p.id}">Details</button>${buyBtn(p, 'sm')}</div></div></article>`;

const GROUPS = [['Men', 'For Him'], ['Women', 'For Her'], ['Unisex', 'For Everyone']];
function drawGrid() {
  let L = PRODUCTS.filter(p => (gen === 'All' || p.gender === gen) && (cat === 'All' || p.cat === cat)
    && (p.name + ' ' + p.cat + ' ' + p.gender).toLowerCase().includes(term));
  if (sort) L = [...L].sort((a, b) => sort === 'asc' ? pv(a) - pv(b) : pv(b) - pv(a));
  $('#grid').innerHTML = GROUPS.map(([g, label]) => {
    const items = L.filter(p => p.gender === g);
    return items.length ? `<h3 class="gh">${label} <small>${items.length} fragrance${items.length > 1 ? 's' : ''}</small></h3><div class="grid">${items.map(card).join('')}</div>` : '';
  }).join('');
  $('#none').hidden = L.length > 0;
  $$('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.c === cat));
  $$('.tab').forEach(t => t.setAttribute('aria-pressed', t.dataset.g === gen));
  reveal();
}
$('#chips').innerHTML = ['All', ...new Set(PRODUCTS.map(p => p.cat))]
  .map(c => `<button class="chip" data-c="${c}" aria-pressed="false">${c}</button>`).join('');
$('#tabs').innerHTML = ['All', ...GROUPS.map(g => g[0]).filter(g => PRODUCTS.some(p => p.gender === g))]
  .map(g => `<button class="tab" data-g="${g}" aria-pressed="false">${g}</button>`).join('');

/* Cart: add, remove, quantity, subtotal, drawer */
const lines = () => cart.map(i => ({ p: PRODUCTS.find(p => p.id === i.id), q: i.q })).filter(l => l.p);
const sub = () => lines().reduce((s, l) => s + eff(l.p) * l.q, 0);
function drawCart() {
  const L = lines();
  $('#cnt').textContent = L.reduce((s, l) => s + l.q, 0);
  $('#items').innerHTML = L.length ? L.map(l => `<div class="ln"><img src="${l.p.img}" alt="">
    <div><b>${l.p.name}</b><div class="q"><button data-q="${l.p.id}:-1" aria-label="Decrease quantity">−</button><span>${l.q}</span><button data-q="${l.p.id}:1" aria-label="Increase quantity">+</button></div>
    <button class="rmv" data-r="${l.p.id}">Remove</button></div><div>${fmt(eff(l.p) * l.q)}</div></div>`).join('')
    : '<p class="empty">Your bag is empty.</p>';
  $('#sub').textContent = fmt(sub());
  $('#chk').disabled = !L.length;
}
function add(id) {
  const pr = PRODUCTS.find(x => x.id === id); if (!pr || pr.price == null) return;
  const i = cart.find(x => x.id === id); i ? i.q = Math.min(20, i.q + 1) : cart.push({ id, q: 1 });
  save(); drawCart(); toast('Added to your bag');
  const n = $('#cnt'); n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump');
}
function qty(id, d) {
  const i = cart.find(x => x.id === id); if (!i) return;
  i.q = Math.min(20, i.q + d); if (i.q < 1) cart = cart.filter(x => x !== i);
  save(); drawCart();
}
function openCart(on) {
  $('#cart').classList.toggle('on', on); $('#ov').classList.toggle('on', on);
  $('#cart').setAttribute('aria-hidden', String(!on)); if (on) $('#cclose').focus();
}

/* Modal: product details and checkout */
function modal(html) { const m = $('#modal'); m.innerHTML = html + '<button class="x" data-x aria-label="Close">×</button>'; m.showModal(); }
function checkout() {
  openCart(false);
  const L = lines(), s = sub(), fee = CONFIG.deliveryFee;
  modal(`<form class="f" id="cf"><h2>Checkout</h2>
    <label>Full name<input name="name" required maxlength="80" autocomplete="name"></label>
    <label>Phone number<input name="phone" type="tel" required pattern="[0-9+ ]{10,15}" maxlength="15" title="Digits only, 10 to 15 characters" autocomplete="tel"></label>
    <label>Delivery address<textarea name="addr" rows="2" required maxlength="300" autocomplete="street-address"></textarea></label>
    <label>City<input name="city" required maxlength="60" autocomplete="address-level2"></label>
    <input class="hp" name="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <fieldset class="pay"><legend>Payment method</legend>${CONFIG.payments.map((m, i) => `<label><input type="radio" name="pay" value="${m.label}" ${i ? '' : 'checked'}> ${m.label}</label>`).join('')}</fieldset>
    <div class="sum">${L.map(l => `<p><span>${l.p.name} × ${l.q}</span><span>${fmt(eff(l.p) * l.q)}</span></p>`).join('')}
    <p><span>Delivery fee (placeholder)</span><span>${fmt(fee)}</span></p><p><b>Total</b><b>${fmt(s + fee)}</b></p></div>
    <button class="btn" type="submit">SEND ORDER ON WHATSAPP</button>
    <p class="fine">This opens WhatsApp with your order details${CONFIG.orderUrl ? ' and saves your order with us' : ''}. Your order is not confirmed until we reply.</p></form>`);
  $('#cf').onsubmit = e => {
    e.preventDefault();
    const d = new FormData(e.target);
    if (!L.length) return;
    const id = 'JB-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
    const order = { id, hp: String(d.get('hp') || ''), name: clean(d.get('name')), phone: clean(d.get('phone')), city: clean(d.get('city')),
      addr: clean(d.get('addr')), pay: clean(d.get('pay')), fee, items: L.map(l => ({ id: l.p.id, name: l.p.name, qty: l.q })) };
    const msg = ['Hello Jasbaan, I would like to place an order:', `Order ID: ${id}`,
      ...L.map(l => `- ${l.p.name} x ${l.q}: ${fmt(eff(l.p) * l.q)}`),
      `Delivery fee: ${fmt(fee)}`, `Total: ${fmt(s + fee)}`, `Payment: ${order.pay}`,
      `Name: ${order.name}`, `Phone: ${order.phone}`, `Address: ${order.addr}, ${order.city}`].join('\n');
    /* Open WhatsApp first (browsers block it if it waits), then save the order in the background. */
    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
    if (CONFIG.orderUrl && !order.hp) {
      fetch(CONFIG.orderUrl, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(order) }).catch(() => {});
    }
    cart = []; save(); drawCart();
    $('#modal').close(); toast('Order request opened in WhatsApp. We confirm once we reply.');
  };
}

/* Clicks (one handler for all buttons) */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-a],[data-d],[data-q],[data-r],[data-x],[data-c],[data-g]');
  if (e.target === $('#modal')) return $('#modal').close();
  if (!t) return;
  const g = t.dataset;
  if (g.a) { add(g.a); if ($('#modal').open) $('#modal').close(); }
  if (g.d) { if (MULTI) location.href = g.d + '.html'; else location.hash = '#p-' + g.d; }
  if (g.q) { const [id, d] = g.q.split(':'); qty(id, +d); }
  if (g.r) qty(g.r, -999);
  if (g.x !== undefined) $('#modal').close();
  if (g.c) { cat = g.c; drawGrid(); }
  if (g.g) { gen = g.g; drawGrid(); }
});
$('#cbtn').onclick = () => openCart(true);
$('#cclose').onclick = $('#ov').onclick = () => openCart(false);
$('#chk').onclick = checkout;
document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
$('#sort').onchange = e => { sort = e.target.value; drawGrid(); };
$('#q').oninput = e => { term = e.target.value.trim().toLowerCase(); drawGrid(); };
$('#sbtn').onclick = () => {
  const s = $('#srch'); s.hidden = !s.hidden; $('#sbtn').setAttribute('aria-expanded', String(!s.hidden));
  if (!s.hidden) { $('#q').focus(); location.hash = '#shop'; }
};

/* Mobile menu */
$('#burger').onclick = () => { const o = $('#menu').classList.toggle('on'); $('#burger').setAttribute('aria-expanded', String(o)); };
$$('#menu a').forEach(a => a.onclick = () => { $('#menu').classList.remove('on'); $('#burger').setAttribute('aria-expanded', 'false'); });

/* Newsletter validation (connect an email service for real subscriptions) */
$('#nl').onsubmit = e => {
  e.preventDefault();
  const v = $('#em').value.trim(), m = $('#nlm');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { m.style.color = '#E58A8A'; m.textContent = 'Please enter a valid email address.'; return; }
  m.style.color = 'var(--gold)'; m.textContent = 'Thank you. This form is not connected to an email service yet, so nothing was saved.';
  e.target.reset();
};

/* Testimonial carousel */
const R = $$('.rev'); let ri = 0;
const show = i => { ri = (i + R.length) % R.length; R.forEach((r, k) => r.classList.toggle('on', k === ri)); };
$('#rp').onclick = () => show(ri - 1); $('#rn').onclick = () => show(ri + 1);
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) setInterval(() => show(ri + 1), 7000);

/* FAQ accordion: one open at a time */
$$('details').forEach(d => d.ontoggle = () => { if (d.open) $$('details').forEach(o => { if (o !== d) o.open = false; }); });

/* Videos play only while visible, and stay paused for visitors who prefer reduced motion */
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
/* Background video reuses the hero video file */
$$('video[data-clone]').forEach(v => { const h = $('.himg'); v.poster = h.poster; v.src = h.getAttribute('src'); });

/* The hero plays every video one after another, then starts over. Add more videos by
   adding items to this list (the first two come from the page itself). */
(() => {
  const hv = $('.himg'), v2 = $('#v2');
  const list = [hv, v2].map(v => ({ s: v.getAttribute('src'), p: v.getAttribute('poster') }));
  const ad = ADS.find(a => a.product === 'admire'); if (ad) list.push({ s: ad.src, p: ad.poster, pos: '45% 50%' });
  let k = 0;
  hv.loop = false;
  hv.addEventListener('ended', () => {
    k = (k + 1) % list.length; hv.poster = list[k].p; hv.src = list[k].s; hv.style.objectPosition = list[k].pos || ''; hv.play().catch(() => {});
  });
})();

/* Gold sparkle background */
(function () {
  const c = $('#dust'); if (!c || calm) return;
  const x = c.getContext('2d'); let W, H, P = [];
  function size() {
    W = c.width = innerWidth; H = c.height = innerHeight;
    P = Array.from({ length: Math.min(70, W / 18 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .3, v: Math.random() * .25 + .08, a: Math.random() * .6 + .2 }));
  }
  size(); addEventListener('resize', size);
  (function frame() {
    x.clearRect(0, 0, W, H);
    P.forEach(p => {
      p.y -= p.v; p.x += Math.sin(p.y / 60) * .15; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fillStyle = 'rgba(212,175,90,' + p.a + ')'; x.fill();
    });
    requestAnimationFrame(frame);
  })();
})();

$$('video[data-play]').forEach(v => {
  if (calm) { v.removeAttribute('autoplay'); v.pause(); return; }
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: .25 }).observe(v);
});

/* Launch bundle section on the home page: shows the product that has tag 'Launch offer' */
const bp = PRODUCTS.find(p => p.tag === 'Launch offer'), bb = $('#bundlebox');
if (bp && bb) bb.innerHTML = `<div class="bl sr"><img src="${bp.img2}" alt="${label(bp)} by Jasbaan Perfume Pakistan" loading="lazy">
  <div><small class="gold">Exclusive launch bundle</small><h2>${bp.name}</h2><p class="tl">${bp.tagline}</p>
  <p>Five 5 ml testers in one set: Nayel, Almira, Blue Sea, Gucci Flora and Blue Lady. Limited edition.</p>
  <p class="pr">${priceHTML(bp)} for the whole set</p>
  <div class="pa">${buyBtn(bp, '')}<a class="btn ghost" href="${MULTI ? bp.id + '.html' : '#p-' + bp.id}">See details</a></div></div></div>`;

/* Quotes in the top bar: add or change lines here */
const QUOTES = [
  ['Perfume is the most intense form of memory.', 'Jean-Paul Guerlain'],
  ['Wear perfume wherever you want to be kissed.', 'Coco Chanel'],
  ['A woman who doesn\'t wear perfume has no future.', 'Coco Chanel'],
  ['Nothing is more memorable than a smell.', 'Diane Ackerman'],
  ['Smell is a potent wizard that transports you across thousands of miles and all the years you have lived.', 'Helen Keller']
];
const qEl = $('.bar span');
if (qEl && !calm) {
  let qi = 0;
  setInterval(() => {
    qEl.style.opacity = 0;
    setTimeout(() => { qi = (qi + 1) % QUOTES.length; qEl.textContent = '“' + QUOTES[qi][0] + '” – ' + QUOTES[qi][1]; qEl.style.opacity = 1; }, 400);
  }, 6000);
}

/* Intro splash (once per visit), animated headline, header shrink, card spotlight */
let seen = false; try { seen = !!sessionStorage.getItem('jb-intro'); } catch (e) {}
const noIntro = calm || seen || !!document.body.dataset.product;
if (noIntro) $('#intro').remove();
else {
  try { sessionStorage.setItem('jb-intro', '1'); } catch (e) {}
  setTimeout(() => { const i = $('#intro'); if (i) i.remove(); }, 4100);
  $('#skip').onclick = () => { $('#intro').remove(); document.documentElement.style.setProperty('--base', '.1s'); };
}
document.documentElement.style.setProperty('--base', noIntro ? '.1s' : '3.2s');
const h1 = $('.hero h1');
h1.innerHTML = h1.textContent.split(' ').map((w, i) => `<span class="wd" style="--i:${i}">${w}</span>`).join(' ');
addEventListener('scroll', () => $('.hd').classList.toggle('s', scrollY > 40), { passive: true });
$('#grid').addEventListener('pointermove', e => {
  const c = e.target.closest('.card'); if (!c) return;
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
});

/* Only one ad video plays at a time */
document.addEventListener('play', e => { $$('video[controls]').forEach(v => { if (v !== e.target) v.pause(); }); }, true);

/* Colour and animation for each perfume page (change colours and effects here).
   fx: rise, bubble, smoke, petal or ember. accent, beige and line are colours; bg is the page backdrop. */
const THEMES = {
  'tester-set':    { accent: '#E0B55A', beige: '#D9C79A', line: '#4A3A16', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#4A3510,#0C0905 70%)', fx: 'rise',   fxc: '#F0CF7A' },
  'gucci-flora':   { accent: '#E0B55A', beige: '#D9C79A', line: '#4A3A16', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#4A3510,#0C0905 70%)', fx: 'rise',   fxc: '#F0CF7A' },
  'blue-sea':      { accent: '#5CC8FF', beige: '#A7D3EA', line: '#14405F', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#0D4A78,#04101C 70%)', fx: 'bubble', fxc: '#9ADBFF' },
  'silver-oud':    { accent: '#DADADA', beige: '#BDBDBD', line: '#3A3A3A', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#444,#0B0B0B 70%)',    fx: 'smoke',  fxc: '#E8E8E8' },
  'scent-of-love': { accent: '#F1E9DD', beige: '#CFC7BA', line: '#3D3A36', bg: 'radial-gradient(ellipse 80% 50% at 50% 0%,#55524D,#080808 70%)', fx: 'petal',  fxc: '#FFFFFF' },
  'nayel':         { accent: '#E8B070', beige: '#D8B896', line: '#5A2F20', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#6B3220,#160A14 70%)', fx: 'ember',  fxc: '#F5B070' },
  'admire':        { accent: '#E8A640', beige: '#D8B67C', line: '#5A3812', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#6A3A0E,#0F0803 70%)', fx: 'smoke',  fxc: '#FFB24D' },
  'blue-lady':     { accent: '#F3C48C', beige: '#E0C8A8', line: '#6A4A26', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#9A6430,#1A1008 70%)', fx: 'petal',  fxc: '#FFE2B8' },
  'salaar':        { accent: '#F0A040', beige: '#E0C08A', line: '#5A3A14', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#6A420E,#100A04 70%)', fx: 'rise',   fxc: '#FFD27A' },
  'roma':          { accent: '#F0A6BC', beige: '#E8C6D0', line: '#5A2E3C', bg: 'radial-gradient(ellipse 80% 50% at 70% 0%,#7A3550,#160A10 70%)', fx: 'petal',  fxc: '#FFC4D6' }
};
const FX = {
  rise:   { kind: 'dot',    dir: -1, n: 60, size: [.6, 2],  speed: [.2, .6] },
  bubble: { kind: 'bubble', dir: -1, n: 34, size: [3, 12],  speed: [.3, .9] },
  smoke:  { kind: 'smoke',  dir: -1, n: 14, size: [40, 110], speed: [.15, .4] },
  petal:  { kind: 'petal',  dir: 1,  n: 26, size: [4, 9],   speed: [.25, .7] },
  ember:  { kind: 'dot',    dir: -1, n: 50, size: [.8, 2.4], speed: [.4, 1.1], flicker: true }
};
let fxRun = 0;
function startFx(canvas, type, color) {
  const cfg = FX[type]; if (!cfg || calm || !canvas) return;
  const x = canvas.getContext('2d'), id = ++fxRun; let W, H, P;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const mk = fresh => ({ x: rnd(0, W), y: fresh ? rnd(0, H) : (cfg.dir < 0 ? H + 20 : -20), r: rnd(...cfg.size), v: rnd(...cfg.speed), a: rnd(.25, .8), ph: rnd(0, 6.28) });
  const size = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; P = Array.from({ length: Math.min(cfg.n, W / 14 | 0) }, () => mk(true)); };
  size(); addEventListener('resize', () => { if (id === fxRun) size(); });
  (function frame() {
    if (id !== fxRun || !canvas.isConnected) return;
    x.clearRect(0, 0, W, H);
    P.forEach((p, i) => {
      p.y += p.v * cfg.dir; p.ph += .02; p.x += Math.sin(p.ph) * .4;
      if (p.y < -120 || p.y > H + 120) P[i] = mk(false);
      x.globalAlpha = cfg.flicker ? p.a * (.6 + .4 * Math.sin(p.ph * 4)) : p.a;
      x.fillStyle = x.strokeStyle = color; x.beginPath();
      if (cfg.kind === 'smoke') {
        const g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); g.addColorStop(0, color); g.addColorStop(1, 'transparent');
        x.globalAlpha = p.a * .22; x.fillStyle = g; x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
      } else if (cfg.kind === 'petal') { x.ellipse(p.x, p.y, p.r, p.r * .55, p.ph, 0, 6.283); x.fill(); }
      else { x.arc(p.x, p.y, p.r, 0, 6.283); cfg.kind === 'bubble' ? x.stroke() : x.fill(); }
    });
    requestAnimationFrame(frame);
  })();
}

/* Product pages: #p-silver-oud opens that perfume's own page */
/* Page description (about 100 to 150 words). Notes, lasting, season and occasion are added when you fill them in. */
const describe = p => {
  if (p.long) return p.long;
  const who = { Men: ' for men', Women: ' for women', Unisex: ' for everyone' }[p.gender];
  return [
    `${p.name} is a ${p.cat === 'Signature' ? 'signature' : p.cat.toLowerCase()} eau de parfum from Jasbaan${who}. ${p.tagline}`,
    p.price == null ? 'It comes in a 50 ml bottle. Message us on WhatsApp for the price.' : `It comes in a 50 ml bottle and is priced at ${fmt(eff(p))}.`,
    p.notes ? `Fragrance notes: ${p.notes}.` : '',
    p.lasting ? `Longevity: ${p.lasting.toLowerCase()}.` : '',
    p.season ? `Best season: ${p.season}.` : '',
    p.occasion ? `Best for: ${p.occasion}.` : '',
    'For the best result, spray it on clean, moisturised skin at the wrists and neck, and keep the bottle away from heat and direct sunlight.',
    `To order, add ${p.name} to your bag and send your order on WhatsApp, or message us on +92 371 2272628. Delivery areas, timing and charges are confirmed with you when you order, and the checkout offers Cash on Delivery.`,
    'You can also browse our other fragrances for him, for her and for everyone on the collection page.'
  ].filter(Boolean).join(' ');
};

function pageHTML(p) {
  const rows = [['Size', p.size || '50 ml'], ['Type', p.type || 'Eau de parfum'], ['For', p.gender], ['Family', p.cat], ['Lasting', p.lasting], ['Notes', p.notes], ['Best season', p.season], ['Occasion', p.occasion]].filter(r => r[1]);
  const rel = [...PRODUCTS.filter(x => x !== p && x.gender === p.gender), ...PRODUCTS.filter(x => x !== p && x.gender !== p.gender)].slice(0, 4);
  const alt = `${label(p)} by Jasbaan Perfume Pakistan`;
  return `<canvas id="fx" aria-hidden="true"></canvas><div class="w pg"><a class="back" href="${MULTI ? 'index.html' : ''}#shop">← Back to the collection</a>
    <div class="pg-g"><div class="pg-img"><img src="${p.img}" alt="${alt}">${p.img2 ? `<img src="${p.img2}" alt="${alt}, close view" loading="lazy">` : ''}</div>
    <div class="pg-i"><small class="gold">${p.gender} · ${p.cat}</small><h1>${p.name.split(' ').map((w, i) => `<span class="wd" style="--i:${i}">${w}</span>`).join(' ')}</h1><p class="tl">${p.tagline}</p>
    <p class="pr">${priceHTML(p)}</p>
    <div class="pa">${buyBtn(p, '')}<a class="btn ghost" href="${waLink('Hello Jasbaan, I want to order ' + p.name)}" target="_blank" rel="noopener noreferrer">Order on WhatsApp</a></div>
    <dl class="spec">${rows.map((r, i) => `<div style="--i:${i}"><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')}</dl></div></div>
    <div class="hl">${p.points.map((x, i) => `<div style="--i:${i}">${x}</div>`).join('')}</div>
    ${adsFor(p)}
    <h3>About ${p.name}</h3><p class="about">${describe(p)}</p>
    <h3>Wearing tips</h3><ul class="tips"><li>Apply to clean, moisturised skin so the scent holds better.</li><li>Spray on pulse points such as the wrists and the neck.</li><li>Do not rub your wrists together, it can dull the opening.</li><li>Keep the bottle away from heat and direct sunlight.</li></ul>
    <h3>You may also like</h3><div class="rels">${rel.map(x => `<a class="rel" href="${MULTI ? x.id + '.html' : '#p-' + x.id}"><img src="${x.img}" alt="" loading="lazy"><span>${x.name}</span><b>${x.price == null ? 'Ask for price' : fmt(eff(x))}</b></a>`).join('')}</div></div>`;
}
function route() {
  const m = location.hash.match(/^#p-(.+)$/), id = MULTI ? document.body.dataset.product : (m && m[1]);
  const p = id && PRODUCTS.find(x => x.id === id);
  $('main').hidden = !!p; $('#pp').hidden = !p;
  fxRun++; document.body.classList.toggle('on-pp', !!p);
  if (p) {
    const T = THEMES[p.id] || {}, pp = $('#pp');
    pp.style.cssText = T.accent ? `--gold:${T.accent};--beige:${T.beige};--line:${T.line};--base:.15s;background:${T.bg};background-attachment:fixed` : '--base:.15s';
    pp.innerHTML = pageHTML(p); startFx($('#fx'), T.fx, T.fxc);
    document.title = label(p) + ' | Jasbaan Perfume Pakistan'; scrollTo(0, 0);
  } else {
    $('#pp').style.cssText = '';
    document.title = 'The Jasbaan Perfume | Luxury Eau de Parfum in Pakistan';
    const t = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (t) requestAnimationFrame(() => t.scrollIntoView());
  }
}
addEventListener('hashchange', route);

drawGrid(); drawCart(); reveal(); route();
