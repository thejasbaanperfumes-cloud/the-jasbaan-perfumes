JASBAAN STORE - setup (Roman Urdu)

FILES
  index.html, script.js   website
  products.js             saare products ka data (admin.html isay khud edit karta hai)
  admin.html              admin panel: products + orders (isay kisi ko link na dein)
  apps-script/Code.gs     orders ka backend (Google Sheet)
  images/, videos/        media

1) GITHUB PAR UPLOAD
   Naya repo banayein, zip ki saari files upload karein.
   Settings > Pages > Deploy from branch > main > / (root). Site ka link mil jayega.
   Admin panel: https://USERNAME.github.io/REPO/admin.html

2) ORDERS (Google Sheet)
   a) sheets.new se nayi sheet banayein > Extensions > Apps Script.
   b) Code.gs ka content paste karein. ADMIN_KEY mein apna lamba secret likhein. Save.
   c) Deploy > New deployment > type: Web app > Execute as: Me > Who has access: Anyone > Deploy.
      Google permission maangay to Allow karein. "Web app URL" copy karein.
   d) script.js ke upar CONFIG mein  orderUrl: 'WEB-APP-URL'  paste karein aur GitHub par commit karein.
   Ab har order sheet mein save hoga (naam, phone, address, city, items, total, kahan se aaya, device).
   Code.gs badalne par Deploy > Manage deployments > Edit > New version karna parta hai.

3) PRODUCT EDITING (bina code ke)
   a) GitHub > Settings > Developer settings > Fine-grained tokens > Generate.
      Sirf is repo ko select karein, Permissions > Contents: Read and write.
   b) admin.html kholein > Settings: repo (username/repo), token, Orders URL, Admin key, store name/phone > Save.
   c) Products tab: Add / Edit / photo upload / price / delete / order change.
      Save ke 1-2 minute baad website update ho jati hai.

4) ORDERS MANAGEMENT
   Orders tab: aaj ke orders, pending, total sales, search, status (New > Confirmed > Shipped > Delivered / Cancelled).
   Order kholein: customer, WhatsApp button, items, kahan se order aaya.
   Print invoice (order summary) aur Print parcel label (COD amount ke saath).
   "Print labels" button New + Confirmed sab orders ke labels ek saath nikalta hai.

SECURITY
   Token aur admin key sirf aap ke browser mein save hoti hain. Token kisi ko na dein.
   Delivery fee abhi placeholder hai: script.js mein CONFIG.deliveryFee badlein.
