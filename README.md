# KS Interio — GitHub Pages

This folder is ready to use as the root of a GitHub repository. No build, Node.js server or installation is required.

```text
index.html
styles.css
app.js
assets/
robots.txt
sitemap.xml
.nojekyll
```

## Upload and publish

1. Upload all the contents of this folder to your GitHub repository, keeping `assets/` intact. `index.html` must appear directly in the repository root.
2. In Settings → Pages, select Deploy from a branch → main → / (root), then Save.
3. Wait for the Pages deployment to finish and use the link shown in Settings → Pages.

The ZIP contains these files directly at its root. Extract the ZIP before uploading; do not upload the ZIP itself as the website.

All CSS, JavaScript, image and font paths are relative, so they support a GitHub Pages repository subpath.

## SEO when moving hosting

Canonical, social sharing, structured-data and sitemap URLs currently point to `https://ks-interio.iammsumit.chatgpt.site/`. Once your final GitHub Pages or custom-domain URL is known, update those absolute URLs in `index.html`, `robots.txt` and `sitemap.xml` to that exact base URL (including the repository path for a project site). Relative asset paths do not need changing.

## Contact form

The form validates the enquiry and opens WhatsApp with the details prepared. The visitor taps Send in WhatsApp to send the message. GitHub Pages does not need a backend for this flow.

Business details and media provenance are recorded in `ASSET-SOURCES.md`; third-party licenses remain inside `assets/`.
