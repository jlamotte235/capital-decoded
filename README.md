# Capital Decoded — Website

A fast, faceless, fully Claude-manageable static site for clear real estate insights.
No build dependencies, no database, no third-party CMS. Just edit text files and run one command.

Live domain: https://capitaldecoded.com

---

## How it works (the 30-second version)

- All copy lives in plain text files. You (or Claude) edit them.
- Run `node build.mjs` to generate the finished website into the `dist/` folder.
- `dist/` is what gets published to the web.

There is no framework to learn. If you can edit a text file, you can run this site.

---

## Folder structure

```
site/
├── content/
│   ├── config.mjs            ← all site copy: home, nav, videos, resources, contact
│   └── articles/             ← one .md file per article (this is your blog)
├── assets/
│   ├── styles.css            ← the design system (colors, layout)
│   ├── logo.svg              ← full logo
│   ├── logo-mark.svg         ← icon-only logo
│   └── favicon.svg           ← browser tab icon
├── build.mjs                 ← the builder (run this to publish changes)
└── dist/                     ← GENERATED output — this is the actual website
```

---

## Publishing a new article (your "scheduled update")

1. Add a new file in `content/articles/`, e.g. `my-new-post.md`.
2. Start it with this header (called "frontmatter"):

```
---
title: Your Headline Here
category: wealth-mindset       # or: borrower-guides | investor-insights | market-updates
date: 2026-06-20
readtime: 5 min read
excerpt: One or two sentences that appear in the preview card.
featured: false                # set true to feature it at the top of the homepage
---

Write the article body here in plain Markdown.

## Section headings use two hashes

- Bullet points work
- **Bold** and *italic* work

> Pull quotes use a greater-than sign.
```

3. Run `node build.mjs`.
4. The new article appears automatically on the homepage, in the Articles list, and gets its own page.

That's the whole publishing flow. Adding a markdown file + rebuilding = a new post. This is exactly what a scheduled automation will do for you (see AUTOMATION.md).

---

## Editing existing pages

- Homepage, navigation, newsletter text, videos, resources, contact → edit `content/config.mjs`.
- Adding a video → add its YouTube ID to the `videos.items` list in `content/config.mjs`.
- Colors / fonts / spacing → `assets/styles.css` (top of file has the color palette).

Always run `node build.mjs` after editing.

---

## Deploying (one-time setup)

See DEPLOY.md for step-by-step instructions to put this online at capitaldecoded.com using your GitHub account, free hosting, and your GoDaddy domain.
