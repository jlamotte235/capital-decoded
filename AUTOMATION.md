# Capital Decoded — Content Automation Plan

Your goal: one place to APPROVE content, and on approval it auto-publishes to BOTH your
website and your social accounts. Nothing goes live without your tap.

The catch worth knowing up front: no single consumer app posts to Instagram AND updates a
website. So the right design is one "approval surface" plus an automation that fans out to
both. Below is the recommended setup, built around tools that genuinely do this.

---

## The architecture (how the pieces fit)

```
   Claude (drafts on a schedule)
            │
            ▼
   [ Approval surface ]  ← YOU approve here (one tap)
            │
     ┌──────┴───────┐
     ▼              ▼
  Website         Socials
 (GitHub →       (Instagram,
  Cloudflare)     LinkedIn, etc.)
```

1. **Claude drafts.** On a schedule (e.g. every Monday), Claude writes the article + the
   matching social caption and image, and drops them into your approval surface as drafts.
2. **You approve.** One tap / one checkbox. This is your control point.
3. **It fans out.** Approval triggers two things automatically: the article is committed to
   GitHub (Cloudflare republishes the site), and the social posts are scheduled/posted.

---

## Recommended tools

**Social scheduling + approval: Buffer** (primary recommendation)
- Clean draft → approval workflow, schedules to Instagram, LinkedIn, Facebook, X, TikTok.
- Simple enough to run yourself; you approve from the app or email.
- Alternative if you want richer Instagram grid/carousel planning: **Publer** or **Later**
  (both show a visual grid preview, which matches the @themarkethustle layout style).

**Website auto-publish: GitHub + Cloudflare Pages**
- Already your site's home (see DEPLOY.md). A commit = a live update.

**The connector that ties approval → both outputs: Zapier** (or Make.com)
- Zapier is already available in this workspace.
- Zapier can: post/schedule to Buffer, AND commit a file to GitHub ("Create or Update File"
  action). One approval can trigger both.

**One approval surface: an Airtable (or Notion) "Content Calendar"**
- Each row = one piece of content: headline, body, caption, image, status.
- A single "Approved ✓" checkbox is all you touch.
- Zapier watches for Approved = true and does the rest.

---

## Two ways to run it (pick based on how hands-off you want to be)

### Option A — Lightest lift (recommended to start)
- Claude writes the article markdown + a caption each week.
- You review in chat and say "ship it."
- Claude commits to GitHub (site updates) and queues the social post in Buffer for your
  final approval there.
- Pros: minimal setup, you stay close to the content. Cons: two quick approvals.

### Option B — Fully systemized (one approval surface)
- Set up the Airtable content calendar + Zapier.
- Claude fills new rows on a schedule.
- You flip one "Approved" checkbox per item.
- Zapier fans out to GitHub (website) + Buffer (socials) automatically.
- Pros: true single-tap approval for both. Cons: ~1 hour of one-time setup + connecting
  Instagram (needs a Business/Creator account linked to a Facebook Page — required by
  Instagram for any scheduling tool).

---

## What Claude needs from you to set this up
- Connect (or approve connecting) Buffer + GitHub in Zapier.
- An Instagram Business or Creator account (free to switch) linked to a Facebook Page —
  this is Instagram's requirement for ANY auto-posting tool, not specific to us.
- A decision on Option A vs B.

Claude can then build the schedule and the Zaps with you.

---

## Note on Instagram auto-posting
Instagram only allows automated publishing through approved partners (Buffer, Later, Publer,
Meta's own tools) and only for Business/Creator accounts. Personal accounts can't be
auto-posted to. The grid of post graphics + captions can be fully prepared in advance either
way — only the final "publish" needs the Business account.
