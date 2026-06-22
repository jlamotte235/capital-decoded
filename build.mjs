// =====================================================================
// CAPITAL DECODED — STATIC SITE BUILDER (zero dependencies)
// Usage: node build.mjs
// Output: ./dist (ready to deploy to any static host)
// =====================================================================
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site, nav, home, videos, resources, contact } from "./content/config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const OUT = path.join(ROOT, "dist");

const CATEGORIES = {
"wealth-mindset": "Wealth Mindset",
"borrower-guides": "Borrower Guides",
"investor-insights": "Investor Insights",
"market-updates": "Market Updates",
};

/* ---------- tiny markdown parser (headings, p, lists, bold, em, links, quote, hr) ---------- */
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function inline(s){
return esc(s)
.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1">')
.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')
.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")
.replace(/(^|[^*])\*([^*]+)\*/g,"$1<em>$2</em>")
.replace(/`([^`]+)`/g,"<code>$1</code>");
}
function markdown(md){
const lines = md.replace(/\r/g,"").split("\n");
let html = "", i = 0;
const flushList = (buf,ord)=>{ if(!buf.length) return ""; const t=ord?"ol":"ul";
const r=`<${t}>`+buf.map(x=>`<li>${inline(x)}</li>`).join("")+`</${t}>`; buf.length=0; return r; };
let ul=[], ol=[];
while(i<lines.length){
let l = lines[i];
if(/^\s*$/.test(l)){ html+=flushList(ul,false)+flushList(ol,true); i++; continue; }
if(/^### /.test(l)){ html+=flushList(ul)+flushList(ol,true); html+=`<h3>${inline(l.slice(4))}</h3>`; i++; continue; }
if(/^## /.test(l)){ html+=flushList(ul)+flushList(ol,true); html+=`<h2>${inline(l.slice(3))}</h2>`; i++; continue; }
if(/^# /.test(l)){ html+=flushList(ul)+flushList(ol,true); html+=`<h2>${inline(l.slice(2))}</h2>`; i++; continue; }
if(/^>\s?/.test(l)){ html+=flushList(ul)+flushList(ol,true); html+=`<blockquote>${inline(l.replace(/^>\s?/,""))}</blockquote>`; i++; continue; }
if(/^---\s*$/.test(l)){ html+=flushList(ul)+flushList(ol,true); html+="<hr>"; i++; continue; }
if(/^[-*] /.test(l)){ html+=flushList(ol,true); ul.push(l.replace(/^[-*] /,"")); i++; continue; }
if(/^\d+\. /.test(l)){ html+=flushList(ul,false); ol.push(l.replace(/^\d+\.\s/,"")); i++; continue; }
// paragraph (gather consecutive non-empty)
html+=flushList(ul)+flushList(ol,true);
let para=[l]; i++;
while(i<lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,3} |> |---|[-*] |\d+\. )/.test(lines[i])){ para.push(lines[i]); i++; }
html+=`<p>${inline(para.join(" "))}</p>`;
}
html+=flushList(ul)+flushList(ol,true);
return html;
}

/* ---------- frontmatter ---------- */
function parseFront(raw){
const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
if(!m) return { data:{}, body: raw };
const data={};
for(const line of m[1].split("\n")){
const mm = line.match(/^(\w+):\s*(.*)$/); if(!mm) continue;
let v = mm[2].trim().replace(/^["']|["']$/g,"");
if(v==="true") v=true; else if(v==="false") v=false;
data[mm[1]]=v;
}
return { data, body: m[2] };
}

/* ---------- SVG icons ---------- */
const ICON = {
key:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8B43A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2m-4 0 4 0 0 4m-9 5 3 3"/></svg>`,
trend:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8B43A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M17 3h4v4"/></svg>`,
chart:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8B43A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>`,
};
const SOCIAL = {
instagram:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
youtube:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.4 12 31 31 0 0 0 23 7.5zM9.8 15.3V8.7l5.7 3.3z"/></svg>`,
linkedin:`<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4V24h-4zM8 8h3.8v2.2h.1c.5-1 1.8-2.2 3.9-2.2 4.1 0 4.9 2.7 4.9 6.2V24h-4v-7c0-1.7 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7V24H8z"/></svg>`,
x:`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7.5 8.6L22.5 22H16l-5-6.6L5.2 22H2l8-9.2L1.5 2H8l4.6 6.1zM16.8 20h1.7L7.3 3.8H5.5z"/></svg>`,
};

/* ---------- layout shell ---------- */
function head(title, desc, canonical){
return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${site.url}${canonical||"/"}">
<meta name="theme-color" content="#0A0E1A">
<link rel="stylesheet" href="/assets/styles.css">
</head><body>`;
}
function header(active){
const links = nav.map(n=>`<a href="${n.href}"${n.href===active?' class="active"':''}>${n.label}</a>`).join("");
return `<header class="site-header"><div class="wrap">
<a class="brand" href="/"><img src="/assets/logo.svg" alt="${site.name}"></a>
<button class="nav-toggle" aria-label="Menu" onclick="document.getElementById('nav').classList.toggle('open')">&#9776;</button>
<nav class="nav" id="nav">${links}<a class="btn btn-primary" href="/#newsletter">Subscribe</a></nav>
</div></header>`;
}
function footer(){
const soc = Object.entries(site.social).filter(([,v])=>v).map(([k,v])=>`<a href="${v}" aria-label="${k}" target="_blank" rel="noopener">${SOCIAL[k]||""}</a>`).join("");
return `<footer class="site-footer"><div class="wrap">
<div class="footer-grid">
<div class="footer-brand">
<img src="/assets/logo.svg" alt="${site.name}">
<p>${esc(site.description)}</p>
${soc?`<div class="socials">${soc}</div>`:""}
</div>
<div class="footer-links">
<div class="footer-col"><h4>Explore</h4>
<a href="/articles/">Articles</a><a href="/resources/">Resources</a></div>
<div class="footer-col"><h4>Topics</h4>
<a href="/articles/?category=borrower-guides">Borrower Guides</a>
<a href="/articles/?category=investor-insights">Investor Insights</a>
<a href="/articles/?category=market-updates">Market Updates</a></div>
<div class="footer-col"><h4>Connect</h4>
<a href="/contact/">Contact</a><a href="/#newsletter">Newsletter</a></div>
</div>
</div>
<div class="footer-bottom">
<span>&copy; ${new Date().getFullYear()} ${site.name}. Educational content only — not financial, legal, or investment advice.</span>
<span>${site.domain}</span>
</div>
</div></footer>
<script>
// Capital Decoded — form handling: newsletter + resources -> HubSpot; contact -> email
(function(){
var HS_PORTAL="246507952", HS_FORM="2487b0df-72e4-4ec5-bc95-0c3213beb9df", BRAND_EMAIL="capitaldecoded235@gmail.com";
function hsSubmit(email){
return fetch("https://api.hsforms.com/submissions/v3/integration/submit/"+HS_PORTAL+"/"+HS_FORM,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:[{name:"email",value:email}],context:{pageUri:location.href,pageName:document.title}})});
}
function findMsg(f){ return f.parentElement.querySelector(".form-msg") || f.querySelector(".form-msg"); }
// Resource "get the guide" forms -> capture to HubSpot, then reveal the guide
document.querySelectorAll("form.resource-form").forEach(function(f){
f.addEventListener("submit",function(e){e.preventDefault();
var inp=f.querySelector("input[type=email]"); var email=inp?inp.value.trim():"";
var file=f.getAttribute("data-file"); var m=findMsg(f);
if(!email){ if(m) m.textContent="Please enter your email."; return; }
if(m) m.textContent="Sending your guide…";
var done=function(){ if(m){ m.innerHTML = file ? ("✓ Check your email — or <a href=\""+file+"\" download>download it now &rarr;</a>") : "✓ You're on the list! Your guide is on the way."; } };
hsSubmit(email).then(done,done); f.reset();
});
});
// Newsletter / generic capture forms (not contact, not resource)
document.querySelectorAll("form[data-capture]:not(.contact-form)").forEach(function(f){
f.addEventListener("submit",function(e){e.preventDefault();
var inp=f.querySelector("input[type=email]"); var email=inp?inp.value.trim():"";
var m=findMsg(f);
if(!email){ if(m) m.textContent="Please enter your email."; return; }
if(m) m.textContent="Subscribing…";
hsSubmit(email).then(function(r){ if(m) m.textContent=(r&&(r.ok||r.status===200))?"✓ You're subscribed! Check your inbox for a welcome email.":"Hmm, that didn't go through — please try again."; },function(){ if(m) m.textContent="✓ You're subscribed! Check your inbox shortly."; });
f.reset();
});
});
// Contact form -> also capture email, then open mail app
document.querySelectorAll("form.contact-form").forEach(function(f){
f.addEventListener("submit",function(e){e.preventDefault();
var nm=(f.querySelector("input[name=name]")||{}).value||"";
var em=(f.querySelector("input[name=email]")||{}).value||"";
var tx=(f.querySelector("textarea")||{}).value||"";
var m=f.querySelector(".form-msg");
if(em) hsSubmit(em).catch(function(){});
window.location.href="mailto:"+BRAND_EMAIL+"?subject="+encodeURIComponent("Capital Decoded inquiry from "+nm)+"&body="+encodeURIComponent(tx+"  —  "+nm+" ("+em+")");
if(m) m.textContent="Opening your email app to send…";
});
});
})();
</script>
</body></html>`;
}
function page({title,desc,active,canonical,body}){
return head(title,desc,canonical)+header(active)+body+footer();
}

/* ---------- reusable blocks ---------- */
function newsletterBlock(){
return `<section class="section" id="newsletter"><div class="narrow">
<div class="newsletter">
<p class="eyebrow">Newsletter</p>
<h2>${esc(home.newsletter.heading)}</h2>
<p>${esc(home.newsletter.blurb)}</p>
<form class="signup" data-capture ${site.newsletterAction?`action="${site.newsletterAction}" method="post"`:""}>
<input type="email" name="email" placeholder="you@email.com" required>
<button class="btn btn-primary" type="submit">${esc(home.newsletter.cta)}</button>
<span class="note">No spam. Unsubscribe anytime.</span>
</form>
<p class="form-msg"></p>
</div>
</div></section>`;
}
function thumb(cat,label){
return `<div class="thumb thumb-${cat||"default"}"><div class="thumb-label">${esc(label)}</div></div>`;
}
function fmtDate(d){ try{return new Date(d).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});}catch{return d;} }

/* ---------- load articles ---------- */
async function loadArticles(){
const dir = path.join(ROOT,"content","articles");
let files=[]; try{ files=(await fs.readdir(dir)).filter(f=>f.endsWith(".md")); }catch{}
const arts=[];
for(const f of files){
const raw = await fs.readFile(path.join(dir,f),"utf8");
const {data,body}=parseFront(raw);
const slug = data.slug || f.replace(/\.md$/,"");
arts.push({
slug, title:data.title||slug, category:data.category||"market-updates",
date:data.date||"", excerpt:data.excerpt||"", featured:data.featured===true,
readtime:data.readtime||"", html:markdown(body),
});
}
arts.sort((a,b)=> (b.date||"").localeCompare(a.date||""));
return arts;
}

/* ---------- page builders ---------- */
function articleCard(a){
return `<a class="post-card" href="/articles/${a.slug}/">
${thumb(a.category, CATEGORIES[a.category]||"Insight")}
<div class="body">
<span class="tag">${CATEGORIES[a.category]||"Insight"}</span>
<h3>${esc(a.title)}</h3>
<p class="snippet">${esc(a.excerpt)}</p>
<p class="meta">${fmtDate(a.date)}${a.readtime?` · ${a.readtime}`:""}</p>
</div></a>`;
}

function buildHome(arts){
const latest = arts[0];
const second = arts[1];
const featuredVideo = videos.items[0];
const tiles = home.categories.map(c=>`<a class="tile" href="${c.href}">
<div class="ic">${ICON[c.icon]||ICON.chart}</div>
<h3>${esc(c.title)}</h3><p>${esc(c.blurb)}</p></a>`).join("");
const featured = `<section class="section"><div class="wrap">
<div class="section-head"><p class="eyebrow">Featured</p><h2>Latest insights</h2></div>
<div class="featured-grid">
${latest?`<a class="feature-card" href="/articles/${latest.slug}/">
${thumb(latest.category, CATEGORIES[latest.category]||"Insight")}
<div class="body"><span class="tag">${CATEGORIES[latest.category]||"Insight"}</span>
<h3 style="font-size:1.5rem">${esc(latest.title)}</h3>
<p class="text-muted">${esc(latest.excerpt)}</p></div></a>`:""}
${second?`<a class="feature-card" href="/articles/${second.slug}/">
${thumb(second.category, CATEGORIES[second.category]||"Insight")}
<div class="body"><span class="tag">${CATEGORIES[second.category]||"Insight"}</span>
<h3 style="font-size:1.5rem">${esc(second.title)}</h3>
<p class="text-muted">${esc(second.excerpt)}</p></div></a>`:""}
</div></div></section>`;
const body = `
<section class="hero"><div class="narrow">
<p class="eyebrow">${esc(home.hero.eyebrow)}</p>
<h1>${esc(home.hero.headline)}</h1>
<p class="lead">${esc(home.hero.subhead)}</p>
<div class="hero-ctas">
<a class="btn btn-primary" href="${home.hero.primaryCta.href}">${esc(home.hero.primaryCta.label)}</a>
<a class="btn btn-ghost" href="${home.hero.secondaryCta.href}">${esc(home.hero.secondaryCta.label)}</a>
</div>
</div></section>
${featured}
<section class="section section-sm"><div class="wrap">
<div class="section-head"><p class="eyebrow">Browse by topic</p><h2>Find what matters to you</h2></div>
<div class="tiles">${tiles}</div>
</div></section>
<div class="band"><div class="narrow">
<p class="eyebrow">Our mission</p>
<h2>${esc(home.why.heading)}</h2>
<p>${esc(home.why.body)}</p>
</div></div>
${newsletterBlock()}`;
return page({title:`${site.name} — ${site.tagline}`,desc:site.description,active:"/",canonical:"/",body});
}

function buildArticlesIndex(arts){
const chips = `<button class="chip active" data-cat="all">All</button>`+
Object.entries(CATEGORIES).map(([k,v])=>`<button class="chip" data-cat="${k}">${v}</button>`).join("");
const cards = arts.map(a=>`<div class="post-item" data-cat="${a.category}">${articleCard(a)}</div>`).join("");
const body = `
<section class="section"><div class="wrap">
<div class="section-head"><p class="eyebrow">The Library</p><h1 style="font-size:2.6rem">Articles</h1>
<p class="text-muted">Practical, real-world insights — sorted by what you need.</p></div>
<div class="filters">${chips}</div>
<div class="post-grid" id="grid">${cards||'<p class="text-muted">New articles coming soon.</p>'}</div>
</div></section>
${newsletterBlock()}
<script>
var url=new URLSearchParams(location.search), pre=url.get('category');
function filter(cat){
document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.cat===cat));
document.querySelectorAll('.post-item').forEach(i=>{i.style.display=(cat==='all'||i.dataset.cat===cat)?'':'none';});
}
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>filter(c.dataset.cat)));
if(pre) filter(pre);
</script>`;
return page({title:`Articles — ${site.name}`,desc:"Practical real estate articles for borrowers, investors, and brokers.",active:"/articles/",canonical:"/articles/",body});
}

function buildArticle(a, arts){
const related = arts.filter(x=>x.slug!==a.slug && x.category===a.category).slice(0,3);
const relatedBlock = related.length?`<section class="section section-sm"><div class="wrap">
<div class="section-head"><p class="eyebrow">Keep reading</p><h2>More ${CATEGORIES[a.category]||""}</h2></div>
<div class="post-grid">${related.map(articleCard).join("")}</div></div></section>`:"";
const body = `
<article>
<div class="article-hero"><div class="narrow">
<span class="tag">${CATEGORIES[a.category]||"Insight"}</span>
<h1>${esc(a.title)}</h1>
<p class="article-meta">${fmtDate(a.date)}${a.readtime?` · ${a.readtime}`:""}</p>
</div></div>
${thumb(a.category, CATEGORIES[a.category]||"Insight")}
<div class="section"><div class="narrow article-body">
${a.html}
<div class="inline-cta">
<h3>Want insights like this in your inbox?</h3>
<p>Short, practical, no fluff. Join the Capital Decoded newsletter.</p>
<a class="btn btn-primary" href="/#newsletter">Subscribe Free</a>
</div>
</div></div>
</article>
${relatedBlock}`;
return page({title:`${a.title} — ${site.name}`,desc:a.excerpt,active:"/articles/",canonical:`/articles/${a.slug}/`,body});
}

function buildVideos(){
const grid = videos.items.length
? `<div class="video-grid">${videos.items.map(v=>`<div class="video-card">
<div class="frame"><iframe src="https://www.youtube.com/embed/${v.youtubeId}" allowfullscreen></iframe></div>
<div class="body"><span class="tag">${esc(v.category||"Video")}</span><h3 style="color:var(--text);font-size:1.1rem;margin:0">${esc(v.title)}</h3></div>
</div>`).join("")}</div>`
: `<div class="empty-state"><h3 style="color:var(--text)">Videos are on the way</h3>
<p>Short, clear videos — Conversations, Updates, and Quick Tips — posting soon.<br>
Follow along on <a href="${site.social.instagram}">Instagram</a> to catch them first.</p></div>`;
const body = `<section class="section"><div class="wrap">
<div class="section-head"><p class="eyebrow">Watch</p><h1 style="font-size:2.6rem">Videos</h1>
<p class="text-muted">${esc(videos.intro)}</p></div>
${grid}
</div></section>${newsletterBlock()}`;
return page({title:`Videos — ${site.name}`,desc:videos.intro,active:"/videos/",canonical:"/videos/",body});
}

function buildResources(){
const cards = resources.items.map(r=>`<div class="resource-card">
<span class="tag">Free Guide</span>
<h3>${esc(r.title)}</h3><p>${esc(r.blurb)}</p>
<form class="gate signup resource-form" data-file="${r.file||""}" style="justify-content:flex-start">
<input type="email" name="email" placeholder="Your email" required>
<button class="btn btn-primary" type="submit">Get the guide</button>
</form>
<p class="form-msg" style="text-align:left;margin-top:10px"></p></div>`).join("");
const body = `<section class="section"><div class="wrap">
<div class="section-head"><p class="eyebrow">Free Tools</p><h1 style="font-size:2.6rem">Resources</h1>
<p class="text-muted">${esc(resources.intro)}</p></div>
<div class="resource-list">${cards}</div>
</div></section>`;
return page({title:`Resources — ${site.name}`,desc:resources.intro,active:"/resources/",canonical:"/resources/",body});
}

function buildContact(){
const body = `<section class="section"><div class="wrap">
<div class="contact-grid">
<div>
<p class="eyebrow">Say hello</p>
<h1 style="font-size:2.6rem">Contact</h1>
<p class="text-muted">${esc(contact.intro)}</p>
<p style="margin-top:24px"><strong>Email</strong><br><a href="mailto:${contact.email}">${contact.email}</a></p>
${contact.showBooking&&contact.bookingUrl?`<p style="margin-top:18px"><a class="btn btn-ghost" href="${contact.bookingUrl}">Book a time</a></p>`:""}
</div>
<form class="contact-form" data-capture>
<div class="field"><label>Name</label><input type="text" name="name" required></div>
<div class="field"><label>Email</label><input type="email" name="email" required></div>
<div class="field"><label>Message</label><textarea name="message" required></textarea></div>
<button class="btn btn-primary" type="submit">Send message</button>
<p class="form-msg"></p>
</form>
</div>
</div></section>`;
return page({title:`Contact — ${site.name}`,desc:"Get in touch with Capital Decoded.",active:"/contact/",canonical:"/contact/",body});
}

/* ---------- write helpers ---------- */
async function write(rel, html){
const file = path.join(OUT, rel);
await fs.mkdir(path.dirname(file), {recursive:true});
await fs.writeFile(file, html, "utf8");
console.log(" ✓", rel);
}
async function copyDir(src, dest){
await fs.mkdir(dest,{recursive:true});
for(const e of await fs.readdir(src,{withFileTypes:true})){
const s=path.join(src,e.name), d=path.join(dest,e.name);
if(e.isDirectory()) await copyDir(s,d); else await fs.copyFile(s,d);
}
}

/* ---------- main ---------- */
async function main(){
console.log("Building Capital Decoded…");
try{await fs.rm(OUT,{recursive:true,force:true});}catch{/* mount may forbid unlink; overwrite instead */}
const arts = await loadArticles();

await write("index.html", buildHome(arts));
await write("articles/index.html", buildArticlesIndex(arts));
for(const a of arts) await write(`articles/${a.slug}/index.html`, buildArticle(a, arts));
await write("resources/index.html", buildResources());
await write("contact/index.html", buildContact());

// assets
await copyDir(path.join(ROOT,"assets"), path.join(OUT,"assets"));
// helpful files for hosting
await fs.writeFile(path.join(OUT,"robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
const urls = ["/","/articles/","/resources/","/contact/",...arts.map(a=>`/articles/${a.slug}/`)];
await fs.writeFile(path.join(OUT,"sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`+
urls.map(u=>` <url><loc>${site.url}${u}</loc></url>`).join("\n")+`\n</urlset>\n`);
await fs.writeFile(path.join(OUT,"CNAME"), site.domain+"\n"); // for GitHub Pages custom domain

console.log(`\nDone. ${arts.length} articles. Output → /dist`);
}
main().catch(e=>{console.error(e);process.exit(1);});
