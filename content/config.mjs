// =====================================================================
//  CAPITAL DECODED — SITE CONFIG
// =====================================================================

export const site = {
  name: "Capital Decoded",
  domain: "capitaldecoded.com",
  url: "https://capitaldecoded.com",
  tagline: "Real Estate, Decoded.",
  description:
    "Clear, practical real estate insights anyone can use. No fluff, no sales pitch — just value.",
  social: {
    instagram: "https://instagram.com/capital.decodedhq",
    youtube: "",
    linkedin: "",
    x: "",
  },
  newsletterAction: "",
  hubspot: { portalId: "246507952", formGuid: "2487b0df-72e4-4ec5-bc95-0c3213beb9df" },
  contactEmail: "capitaldecoded235@gmail.com",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles/" },
  { label: "Resources", href: "/resources/" },
  { label: "Contact", href: "/contact/" },
];

export const home = {
  hero: {
    eyebrow: "Real estate insights worth your time",
    headline: "Real Estate, Decoded.",
    subhead:
      "Clarity is hard to find in real estate. Capital Decoded cuts through the noise with practical, real-world insights for investors, borrowers, and first-time buyers — plus free guides to get you started.",
    primaryCta: { label: "Get the free guides", href: "/resources/" },
    secondaryCta: { label: "Subscribe free", href: "#newsletter" },
  },
  why: {
    heading: "Why Capital Decoded exists",
    body:
      "Most real estate advice is either an oversimplified sales pitch or a wall of jargon. Capital Decoded is a different space — where the whole process gets explained clearly. Practical insights that add value without asking you to buy a class or a product. Our mission is simple: make real estate clearer so anyone can make smarter decisions.",
  },
  categories: [
    { title: "Wealth Mindset", blurb: "Compound interest, patience, and the habits that build real wealth.", href: "/articles/?category=wealth-mindset", icon: "trend" },
    { title: "Borrower Guides", blurb: "Loans, rates, and approvals explained in plain English.", href: "/articles/?category=borrower-guides", icon: "key" },
    { title: "Investor Insights", blurb: "How deals actually work, and the risks worth watching.", href: "/articles/?category=investor-insights", icon: "trend" },
    { title: "Market Updates", blurb: "What's moving the market — and what it means for you.", href: "/articles/?category=market-updates", icon: "chart" },
  ],
  newsletter: {
    heading: "Stay ahead with clear real estate insights",
    blurb:
      "Join the Capital Decoded newsletter for practical updates, market trends, and short takes you can use right away. No fluff, no sales pitches — just value.",
    cta: "Subscribe Free",
  },
};

export const videos = {
  intro:
    "Short videos with clear messages. The fastest way to understand what's really happening in real estate.",
  categories: ["Conversations", "Updates", "Quick Tips"],
  items: [],
};

export const resources = {
  intro:
    "Free guides and checklists to help you make clearer decisions. Pop in your email and we'll send the download straight over.",
  items: [
    { title: "The Borrower's Pre-Approval Checklist", blurb: "Everything you need ready before you apply — so nothing slows you down.", file: "/assets/guides/borrower-pre-approval-checklist.pdf", gated: true },
    { title: "First-Time Investor's Risk Map", blurb: "The questions to ask on any deal, and the red flags that should give you pause.", file: "/assets/guides/first-time-investor-risk-map.pdf", gated: true },
    { title: "Reading a Market in 10 Minutes", blurb: "A simple framework for sizing up any local real estate market quickly.", file: "/assets/guides/reading-a-market-in-10-minutes.pdf", gated: true },
  ],
};

export const contact = {
  intro:
    "Have a question, a topic you'd like decoded, or a partnership idea? Send a note.",
  email: "capitaldecoded235@gmail.com",
  showBooking: false,
  bookingUrl: "",
};
