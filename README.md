# The Jasbaan Perfumes

Website for **The Jasbaan Perfume**: luxury eau de parfum, Karachi, Pakistan.
*Wear confidence.... Wear JASBAAN.*

A static website (plain HTML, CSS and JavaScript). There is no build step and nothing to install.

## Project structure

```
the-jasbaan-perfumes/
├── index.html          Home page (main entry file)
├── style.css           All styling
├── script.js           Shop logic: products, cart, checkout, product pages
├── blue-sea.html       One page per perfume
├── nayel.html          admire.html, blue-lady.html, gucci-flora.html,
├── ...                 roma.html, salaar.html, scent-of-love.html,
│                       silver-oud.html, tester-set.html
├── images/             Logo, banners, perfume photos, ad posters (images/ads/)
├── videos/             Hero videos and ad videos (videos/ads/)
├── sitemap.xml         For Google
├── robots.txt          For search engines
├── _headers            Security headers (Netlify and Cloudflare Pages)
├── .nojekyll           Tells GitHub Pages to serve the files as they are
└── .gitignore
```

## Run it on your computer

Unzip, keep all files and folders together, and double-click `index.html`.

## Deploy on GitHub Pages (free)

1. Upload everything inside the `the-jasbaan-perfumes` folder to your repository, so that `index.html` sits at the top level of the repo (not inside another folder).
   - Website: **Add file → Upload files**, drag in all files and folders, then **Commit changes**.
   - Or Git:
     ```bash
     cd the-jasbaan-perfumes
     git init
     git add .
     git commit -m "Upload Jasbaan Perfumes website"
     git branch -M main
     git remote add origin https://github.com/thejasbaanperfumes-cloud/the-jasbaan-perfumes.git
     git push -u origin main
     ```
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch **main** and folder **/ (root)**, then **Save**.
4. After a minute or two the site is live at
   `https://thejasbaanperfumes-cloud.github.io/the-jasbaan-perfumes/`

All links inside the site are relative, so it works on that address without changes.

## Deploy on Cloudflare Pages or Netlify (optional)

Connect the GitHub repository (or drag the folder in), leave the build command empty and set the output directory to `/` (the root). These hosts also read the `_headers` file, which adds the security headers. GitHub Pages ignores `_headers`, but every page already carries its own Content-Security-Policy tag.

## Custom domain and Google (after you have a real address)

1. Replace `YOUR-DOMAIN` with your real web address in every `.html` file, `sitemap.xml` and `robots.txt`.
2. Add the site to Google Search Console and submit `sitemap.xml`.
3. Add the website link to your Google Business Profile and your Instagram bio.

## Editing the site

Open `script.js`. The top of the file has the settings you will change most often:

- **CONFIG**: WhatsApp number, delivery fee, payment methods, `orderUrl`.
- **PRODUCTS**: name, price, photos, tagline, highlights.
- **ADS**: the ad videos shown on each perfume page.
- **THEMES**: the colour and animation of each perfume page.
- **QUOTES**: the quotes in the top bar.

Colours are in the first lines of `style.css`. The banner is the `<section class="banner">` block in `index.html`.

If you change a price or description in `script.js`, also update that perfume's `.html` file (it holds the same text for search engines).

## Orders

Orders always go to WhatsApp. To also save each order in a Google Sheet, create an Apps Script web app and paste its address into `orderUrl` in `script.js`. Keep the Apps Script file (`Code.gs`) out of this repository.

## Security

Never put passwords or secret keys in any file of this repository. Use https only, and turn on 2-step verification for your GitHub, Google, Instagram and hosting accounts.

## Before launch

- [ ] Delivery fee and policies (FAQ items marked "To be confirmed")
- [ ] Price and photos for Salaar and Roma
- [ ] Fragrance notes and longevity, only if confirmed
- [ ] Real customer reviews to replace the sample ones
- [ ] Business address
- [ ] Right to use the product names, including Gucci Flora (another company's trademark)
- [ ] Check the name: Admire or Almira
- [ ] Domain and hosting
