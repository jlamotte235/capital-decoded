# Capital Decoded — Salesforce Lead Flow & Email Campaign

Goal: every newsletter signup and resource download becomes a clean lead in Salesforce,
lands in the right campaign, and gets a value-first nurture sequence — automatically.
Nothing here is a sales funnel; it's a value pipeline.

---

## Where leads come from (capture points on the site)
1. **Newsletter signup** — hero, inline (after articles), and footer.
2. **Resource downloads** — each free guide is gated by email (Resources page).
3. **Contact form** — Contact page.

All three already exist on the site. Each just needs to be pointed at Salesforce.

---

## Lead record — fields to map
| Salesforce field | Value |
|---|---|
| Email | from the form |
| First/Last Name | if provided (newsletter is email-only; contact form has name) |
| Company | "Individual" (Salesforce requires a value; use a default) |
| Lead Source | `Capital Decoded — Website` |
| Lead Source Detail (custom) | `Newsletter` / `Resource: <guide name>` / `Contact` |
| Topic Interest (custom) | `Wealth Mindset` / `Borrower` / `Investor` / `Market` (optional) |
| Lead Status | `New — Subscriber` |

Tip: create a custom picklist field "Lead Source Detail" so you can tell a newsletter
subscriber apart from a guide downloader from a contact inquiry.

---


---

## How contacts get MARKED (so you can report + market to them)
This is the key requirement: every Capital Decoded subscriber must be identifiable in Salesforce
so you can run a report on just them and send CD-specific marketing.

Use THREE markers (belt and suspenders — each survives lead→contact conversion):
1. **Lead Source = `Capital Decoded`** — standard field, carries to the Contact on conversion.
2. **Custom checkbox `Capital Decoded Subscriber` (on Lead AND Contact)** — map it in
   Setup → Lead Custom Fields → Map so it transfers automatically on conversion. This is your
   cleanest report filter.
3. **Campaign membership in `CD — Newsletter`** — gives you a ready-made marketing audience
   and campaign reporting (signups over time, source, engagement).

**To run your report:** Reports → Contacts → filter `Capital Decoded Subscriber = TRUE`
(or Campaign = CD — Newsletter). Save it as "Capital Decoded — Subscribers."

**To market to them from Salesforce:** use that report/campaign as the recipient list in
Salesforce email, or in Account Engagement (Pardot) / Marketing Cloud if you have it. Segment
further with the `Topic Interest` field (Wealth Mindset / Borrower / Investor / Market) to
send content-specific sends.

## Two ways to connect the site to Salesforce (pick one)

### Option 1 — Salesforce Web-to-Lead (native, no extra tools)
- In Salesforce: Setup → Web-to-Lead → generate the form endpoint + hidden field IDs.
- Paste that endpoint into the site: open `site/content/config.mjs` →
  `newsletterAction: "PASTE_WEB_TO_LEAD_ENDPOINT_HERE"`, then rebuild.
- Pros: free, native, no middleware. Cons: less flexible routing/dedup.

### Option 2 — Zapier (recommended for flexibility; already available here)
- Newsletter provider (or a webhook from the form) → Zapier → "Create/Update Lead" in Salesforce.
- Zapier handles dedup, field mapping, and can also add the lead to a Campaign in one step.
- Pros: dedup, multi-step, easy to extend (e.g., also add to Buffer audience). Cons: one more tool.

---

## Campaign structure in Salesforce
Create one **Campaign** per intent so reporting stays clean:
- `CD — Newsletter` (type: Email, status: In Progress)
- `CD — Resource Downloads` (type: Email)
- `CD — Contact Inquiries` (type: Other)

Every captured lead is added as a **Campaign Member** to the matching campaign
(automatic via Web-to-Lead campaign assignment or the Zapier step). This lets you measure
signups over time and which content drives them.

---

## The nurture email sequence (value-first, faceless)
Sent to the `CD — Newsletter` campaign. Use Salesforce email (or Account Engagement/Pardot
if you have it; Mailchimp/ConvertKit also work if you'd rather keep email there and sync to SF).

**Email 1 — Welcome (immediate)**
Subject: Welcome to Capital Decoded
Body: You're in. Capital Decoded exists to make real estate clearer — practical, real-world
insights with no fluff and nothing to sell. Expect short, useful takes you can actually use.
Here are three to start: [3 article links]. — Capital Decoded

**Email 2 — Day 3: Best of Wealth Mindset**
Subject: The one idea that quietly builds wealth
Body: Compound interest is slow, then sudden… [link to article]. Plus two more reads.

**Email 3 — Day 7: Best of Real Estate**
Subject: How rates actually move the market
Body: Everyone says rates "affect" real estate. Few explain how… [link].

**Email 4 — Day 14: Resource offer**
Subject: A free checklist that saves you a headache
Body: Grab the Pre-Approval Checklist [link]. No strings.

**Ongoing — Weekly digest**
Subject: This week, decoded
Body: The newest article + the week's short video. One email, all value.

(The weekly digest is the email the content automation in AUTOMATION.md can assemble and
send for you on a schedule — you just approve.)

---

## What I need from you to wire this up
- Salesforce login (you do the auth; I never enter credentials).
- Whether you use plain Salesforce email, Account Engagement (Pardot), or an outside email tool.
- A decision: Web-to-Lead (Option 1) or Zapier (Option 2).

Then I can generate the Web-to-Lead field mapping or build the Zap with you, and drop the
endpoint into the site config.
