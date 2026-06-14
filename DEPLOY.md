# Deploying Capital Decoded

Goal: get the site live at https://capitaldecoded.com, on free hosting, set up so Claude can
push updates automatically.

Recommended stack: **GitHub** (stores the site) → **Cloudflare Pages** (hosts + auto-deploys
for free) → **GoDaddy** (your domain points to it).

Why this combo:
- Free, fast, and reliable (global CDN, automatic HTTPS).
- Every time the site changes in GitHub, Cloudflare rebuilds and republishes automatically.
- Claude can commit changes to GitHub, which means Claude can update the live site hands-off.

---

## Step 1 — Put the site on GitHub

1. Create a new repository (e.g. `capital-decoded`) in your GitHub account.
2. Upload the contents of this `site/` folder to the repo.
3. Commit.

Claude can do this with you using your GitHub login, or via the GitHub connector.

---

## Step 2 — Connect Cloudflare Pages

1. Create a free Cloudflare account.
2. Pages → Create a project → Connect to Git → pick the `capital-decoded` repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: `node build.mjs`
   - Build output directory: `dist`
4. Save and deploy. You'll get a temporary URL like `capital-decoded.pages.dev` to confirm it works.

(No-Git alternative: you can drag-and-drop the `dist/` folder straight into Cloudflare Pages
or Netlify for an instant deploy, but Git is what enables hands-off automatic updates.)

---

## Step 3 — Point your GoDaddy domain at it

In Cloudflare Pages → your project → Custom domains → add `capitaldecoded.com` and
`www.capitaldecoded.com`. Cloudflare will show you the exact DNS records to add.

Then in GoDaddy (Domain → DNS), add those records. Two common paths:
- **Easiest:** change your GoDaddy nameservers to Cloudflare's (Cloudflare walks you through this), or
- **Minimal:** add the CNAME/A records Cloudflare gives you in GoDaddy's DNS manager.

DNS changes can take a little while to take effect. After that, https://capitaldecoded.com is live.

---

## Step 4 — Updates from now on

Once connected, publishing is automatic:
- Add/edit a markdown article → commit to GitHub → Cloudflare rebuilds → live in ~1 minute.
- This is the hook the content automation uses (see AUTOMATION.md).

Claude can handle the commit step for you on a schedule, so you only ever approve content.
