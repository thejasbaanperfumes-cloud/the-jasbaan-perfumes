THE JASBAAN PERFUME: WEBSITE FILES
==================================
Files: index.html and one page per perfume (blue-sea.html, nayel.html ...), style.css (look), script.js (shop logic), images/, videos/, sitemap.xml, robots.txt, _headers.

OPEN IT
Unzip into one folder (keep everything together) and double-click index.html.

EDIT (script.js, top of the file)
- CONFIG: WhatsApp number, delivery fee (placeholder), payment methods, orderUrl (see Google Sheet below).
- PRODUCTS: name, price, gender (Men, Women, Unisex), photos, tagline, highlights, lasting, notes, season, occasion. Empty fields are hidden. price: null shows "Price on WhatsApp".
- ADS: each ad video shows on the page of its own perfume. THEMES: colour and animation of each perfume page. QUOTES: the quotes in the top bar.
- Banner at the top: the <section class="banner"> block in index.html. Pictures: images/banner-lineup.jpg (all bottles) and images/banner-man.jpg.
- Colours: first lines of style.css.

GOOGLE AND SEARCH
1. After hosting, replace YOUR-DOMAIN with your real web address in every .html file, sitemap.xml and robots.txt.
2. Google Search Console: add the site, verify it, then submit sitemap.xml.
3. Google Business Profile: category Perfume store, your Karachi address or service area, then add your website link.
4. Put the website link in your Instagram bio.
5. If you edit notes or lasting in script.js, also update the description in that perfume's .html file (or ask for the files to be regenerated).

ORDERS SAVED IN A GOOGLE SHEET (optional)
Orders always go to WhatsApp. To also save each order in a Google Sheet and email it to you: create a Google Sheet, open Extensions then Apps Script, paste the file Code.gs (keep it off your website host), Deploy as Web app (Execute as Me, access Anyone), copy the address into orderUrl in script.js, and place a test order. When prices change, change them in Code.gs too and deploy a new version.

SECURITY
Every page has a Content-Security-Policy, and _headers adds strong headers (Netlify and Cloudflare Pages read it, keep it next to index.html). Customer input is length-limited, cleaned and never put into the page as HTML. Host on https only, never put passwords or secret keys in any file, and use strong passwords with 2-step verification on your Google, Instagram and hosting accounts.

LAUNCH CHECKLIST
[ ] Delivery fee and policies (FAQ items marked [To be confirmed])
[ ] Price and photos for Salaar and Roma
[ ] Fragrance notes and how long each lasts, only if confirmed
[ ] Real customer reviews to replace the sample ones
[ ] Business address
[ ] Right to use the product names, including Gucci Flora (another company's trademark)
[ ] Check the name: Admire or Almira
[ ] Domain and hosting
