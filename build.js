/* =====================================================================
   build.js - Generates the two static pages (English + Arabic) with SEO.

   Run:   node build.js
   Needs: Node 14+ (no npm packages).

   Input : template.html, js/lang/en.js, js/lang/ar.js, seo.config.json
   Output: index.html        (English, served at /)
           ar/index.html     (Arabic,  served at /ar/)
           sitemap.xml, robots.txt

   Why: search engines index the HTML they receive. Before, every text was filled in by
   JavaScript, so Arabic and English could not be indexed as separate pages. Now each
   language is a real page with its own title, description, hreflang and structured data,
   and the text is already inside the HTML.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "seo.config.json"), "utf8"));
const template = fs.readFileSync(path.join(ROOT, "template.html"), "utf8");

/* ----- load the language files (they assign window.LANG.xx) ----- */
const sandbox = { window: {} };
vm.createContext(sandbox);
["en", "ar"].forEach((l) => vm.runInContext(fs.readFileSync(path.join(ROOT, "js/lang", l + ".js"), "utf8"), sandbox));
const LANG = sandbox.window.LANG;

const site = cfg.siteUrl.replace(/\/+$/, "");
if (/YOUR-DOMAIN/.test(site)) {
  console.warn("\n  WARNING: siteUrl in seo.config.json is still the placeholder.\n" +
    "  Put your real address there and run `node build.js` again before deploying,\n" +
    "  otherwise canonical/hreflang/sitemap will point to a site that does not exist.\n");
}

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = { en: site + "/", ar: site + "/ar/" };

/* ----- same markup as main.js (item / marquee / skills / tags) ----- */
function item(x, L, base) {
  const hoursLabel = L === "ar" ? " ساعة" : " hours";
  const tag = x.hours ? `<span class="tag"><span class="cn" data-c="${x.hours}">${x.hours}</span>${hoursLabel}</span>` : "";
  const lg = x.logo ? `<img class="lg" src="${base}assets/logos/${x.logo}.png" alt="" width="60" height="60" loading="lazy">` : "";
  return `<div class="card rv${x.current ? " now" : ""}${x.logo ? " hl" : ""}"><div class="ch">${lg}<div class="ct"><h3>${esc(x.title)}</h3><div class="meta"><span>${esc(x.org)}</span><span>${esc(x.date)}</span>${tag}</div></div></div><p>${esc(x.body)}</p></div>`;
}
function seoHead(L) {
  const D = LANG[L], d = D.ui, c = cfg[L], other = L === "en" ? "ar" : "en";
  const img = site + "/assets/images/profile.jpg";
  const knows = [].concat(D.skills[0].items, D.tech[0].items, D.tech[1].items);
  const personId = url.en + "#person";
  const graph = [
    {
      "@type": "Person", "@id": personId,
      name: d.name, alternateName: cfg.alternateNames,
      jobTitle: L === "ar" ? "مصمم UI/UX" : "UI/UX Designer",
      description: c.description, url: url[L], image: img,
      sameAs: cfg.sameAs,
      address: { "@type": "PostalAddress", addressLocality: "Minya Al Qamh", addressRegion: "Sharqia", addressCountry: "EG" },
      knowsAbout: knows, knowsLanguage: ["ar", "en"]
    },
    { "@type": "WebSite", "@id": url[L] + "#website", url: url[L], name: c.siteName, inLanguage: L, publisher: { "@id": personId } },
    {
      "@type": "ProfilePage", "@id": url[L] + "#profile", url: url[L], name: c.title, description: c.description,
      inLanguage: L, isPartOf: { "@id": url[L] + "#website" }, mainEntity: { "@id": personId }, primaryImageOfPage: img
    },
    {
      "@type": "CreativeWork", name: d.p1T, description: d.p1D, inLanguage: L, author: { "@id": personId },
      url: "https://www.behance.net/gallery/251943223/Mazaq-Food-Delivery-App-UXUI-Case-Study"
    },
    {
      "@type": "CreativeWork", name: d.p2T, description: d.p2D, inLanguage: L, author: { "@id": personId },
      url: "https://www.behance.net/gallery/249426463/Skillo-App-Mobile-UIUX-Design-Case-Study"
    }
  ];
  const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return [
    `<title>${esc(c.title)}</title>`,
    `<meta name="description" content="${esc(c.description)}">`,
    `<meta name="keywords" content="${esc(cfg.keywords[L])}">`,
    `<meta name="author" content="${esc(d.name)}">`,
    `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">`,
    `<link rel="canonical" href="${url[L]}">`,
    `<link rel="alternate" hreflang="en" href="${url.en}">`,
    `<link rel="alternate" hreflang="ar" href="${url.ar}">`,
    `<link rel="alternate" hreflang="x-default" href="${url.en}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(c.siteName)}">`,
    `<meta property="og:title" content="${esc(c.title)}">`,
    `<meta property="og:description" content="${esc(c.description)}">`,
    `<meta property="og:url" content="${url[L]}">`,
    `<meta property="og:locale" content="${c.ogLocale}">`,
    `<meta property="og:locale:alternate" content="${cfg[other].ogLocale}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:width" content="520">`,
    `<meta property="og:image:height" content="520">`,
    `<meta property="og:image:alt" content="${esc(d.altPhoto)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${esc(c.title)}">`,
    `<meta name="twitter:description" content="${esc(c.description)}">`,
    `<meta name="twitter:image" content="${img}">`,
    `<link rel="icon" href="{{BASE}}assets/favicon.svg" type="image/svg+xml">`,
    `<link rel="icon" href="{{BASE}}assets/favicon-48.png" type="image/png" sizes="48x48">`,
    `<link rel="apple-touch-icon" href="{{BASE}}assets/apple-touch-icon.png">`,
    `<script type="application/ld+json">${ld}</script>`
  ].join("\n");
}

function page(L) {
  const D = LANG[L], d = D.ui, rtl = L === "ar", other = rtl ? "en" : "ar";
  const base = rtl ? "../" : "";
  let h = template.replace("{{SEO}}", seoHead(L));

  /* texts: <tag data-i="key"></tag>  ->  <tag data-i="key">text</tag> */
  h = h.replace(/<(\w+)((?:[^>]*?)\sdata-i="([^"]+)"[^>]*)><\/\1>/g, (m, tag, attrs, key) => {
    if (d[key] === undefined) throw new Error("Missing ui key: " + key + " (" + L + ")");
    return `<${tag}${attrs}>${esc(d[key])}</${tag}>`;
  });
  /* placeholders */
  h = h.replace(/\sdata-p="([^"]+)"/g, (m, key) => `${m} placeholder="${esc(d[key])}"`);
  /* counters show their final number even without JavaScript */
  h = h.replace(/data-n="(\d+)"([^>]*)>0</g, 'data-n="$1"$2>$1<');

  /* lists that main.js also draws */
  const chips = (a, n) => a.map((s) => `<span>${esc(s)}</span>`).join("").repeat(n || 4);
  /* marquee: row 1 = design skills, row 2 = professional skills (technical skills have their own section) */
  const row2 = D.skills[1].items;
  const fill = (id, html) => {
    const needle = `id="${id}"></div>`;
    if (!h.includes(needle)) throw new Error("Missing container #" + id);
    h = h.replace(needle, `id="${id}">${html}</div>`);
  };
  fill("m1", chips(D.skills[0].items));
  fill("m2", chips(row2, 6));
  fill("tl", D.experience.map((x) => item(x, L, base)).join(""));
  fill("courses", D.courses.map((x) => item(x, L, base)).join(""));
  fill("sk", D.skills.map((g) => `<div class="skr rv"><h3>${esc(g.title)}</h3><div class="skc">${g.items.map((s, i) => `<span${i < (g.core || 0) ? ' class="pr"' : ""}>${esc(s)}</span>`).join("")}</div></div>`).join(""));
  fill("tk", D.tech.map((g) => `<div class="card rv"><h3>${esc(g.title)}</h3><div class="skc">${g.items.map((s) => `<span>${esc(s)}</span>`).join("")}</div></div>`).join(""));
  h = h.replace(/<div class="pt" data-t="(\d)"><\/div>/g, (m, i) => `<div class="pt" data-t="${i}">${D.projectTags[+i].map((x) => `<span>${esc(x)}</span>`).join("")}</div>`);
  h = h.replace('<span id="rot"></span>', `<span id="rot">${esc(D.rotating[0])}</span>`);

  /* page-level placeholders */
  h = h.replace(/\{\{ui:(\w+)\}\}/g, (m, k) => esc(d[k]))
       .replace(/\{\{LANG\}\}/g, L).replace(/\{\{DIR\}\}/g, rtl ? "rtl" : "ltr")
       .replace(/\{\{BASE\}\}/g, base)
       .replace(/\{\{SEG\}\}/g, rtl
         ? '<div class="seg" dir="ltr"><a id="lang" href="../index.html" hreflang="en" lang="en">EN</a><span class="on" lang="ar" aria-current="true">عربي</span></div>'
         : '<div class="seg" dir="ltr"><span class="on" lang="en" aria-current="true">EN</span><a id="lang" href="ar/index.html" hreflang="ar" lang="ar">عربي</a></div>')
       .replace(/\{\{ALT_HREF\}\}/g, rtl ? "../index.html" : "ar/index.html")
       .replace(/\{\{ALT_LANG\}\}/g, other)
       .replace(/\{\{ALT_LABEL\}\}/g, rtl ? "English" : "عربي");

  const left = h.match(/\{\{[^}]+\}\}/g);
  if (left) throw new Error("Unreplaced placeholders: " + left.join(", "));
  return h;
}

fs.mkdirSync(path.join(ROOT, "ar"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "index.html"), page("en"));
fs.writeFileSync(path.join(ROOT, "ar/index.html"), page("ar"));

const today = new Date().toISOString().slice(0, 10);
const alt = (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url[l]}"/>`;
const sm = ["en", "ar"].map((l) => `  <url>\n    <loc>${url[l]}</loc>\n    <lastmod>${today}</lastmod>\n${alt("en")}\n${alt("ar")}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url.en}"/>\n  </url>`).join("\n");
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sm}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

console.log("Built: index.html, ar/index.html, sitemap.xml, robots.txt  (" + site + ")");
