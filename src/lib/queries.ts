/**
 * Read-side queries for pages. These run on the server (no auth required).
 * Mutations live in /api/admin/*.
 */
import { db, getSite } from "./db";
import {
  HeroData, PhilosophyData, VisitData, ContactData, MetaData,
  Program, Instructor, GalleryItem, Testimonial, FAQItem, HoursItem, NavLink,
  InstagramFeedItem,
  normalizeHero,
} from "./types";

const DEFAULT_INSTAGRAM_FEED: InstagramFeedItem[] = [
  { url: "https://www.instagram.com/p/DAb4F7GPGxC/", caption: "" },
  { url: "https://www.instagram.com/p/DFAOXcKuaFt/", caption: "" },
  { url: "https://www.instagram.com/p/C-mxJD9uIXr/", caption: "" },
  { url: "https://www.instagram.com/p/C3LDR_yuUE0/", caption: "" },
];

const DEFAULT_HERO: HeroData = {
  eyebrow: "Bellaire, Texas · Established academy",
  titleLines: ["Where", "champions", "are made."],
  subtitle:
    "A modern Brazilian Jiu-Jitsu academy built on craft, discipline and quiet confidence. Train with a World Champion. Train with people who care.",
  ctaPrimary: { label: "Book a free trial", href: "/contact" },
  ctaSecondary: { label: "See programs", href: "/programs" },
  social: [
    { label: "Instagram", href: "https://instagram.com/pablosilvabjjhq" },
    { label: "Facebook", href: "https://facebook.com" },
  ],
  values: [
    { title: "Confidence", body: "Earned through real training, not promises." },
    { title: "Self-Defense", body: "Practical, principled, and pressure-tested." },
    { title: "Discipline", body: "Show up. Do the work. Repeat." },
    { title: "Respect", body: "For your partner, your coach, and the art." },
  ],
  portrait: "/images/professor.jpg",
};

const DEFAULT_PHILOSOPHY: PhilosophyData = {
  eyebrow: "01 Philosophy",
  title: "A quiet art,",
  italic: "practiced seriously.",
  body: [
    "At Pablo Silva BJJ we don't promise shortcuts. We promise a thoughtful place to train — refined coaching, premium facilities, and a community that takes the art, and each other, seriously.",
    "In our world-class academy you'll find a clean mat space, a dedicated strength and conditioning room, and personalized instruction from <strong>2010 IBJJF Black Belt World Champion Pablo Silva</strong>. Our classes will challenge you, sharpen your technique, build real confidence, and put you in the best shape of your life.",
    "Men, women, and children from age three upwards train here. Whether your goal is competition, self-defense, or simply a calmer, stronger version of yourself — there is a place for you on the mat.",
  ],
  image: "/images/training-1.jpg",
};

const DEFAULT_VISIT: VisitData = {
  eyebrow: "06 Visit",
  title: "Schedule a",
  italic: "visit.",
  body: "See the facility. Meet the coaches. Watch a class. Your first session is on us — no pressure, no commitment, just a chance to feel the room.",
  address: "5233 Bellaire Blvd, Bellaire, TX 77401",
  mapUrl: "https://maps.google.com/?q=5233+Bellaire+Blvd+Bellaire+TX",
  image: "/images/gi-detail.jpg",
};

const DEFAULT_CONTACT: ContactData = {
  eyebrow: "07 Contact",
  title: "Say hello.",
  body: "Questions about programs, scheduling, or a private session? Reach out — we usually reply within a day.",
  email: "pablosilvabjj@gmail.com",
  phone: "+1 (346) 303-9572",
  whatsapp: "13463039572",
};

const DEFAULT_META: MetaData = {
  title: "Pablo Silva BJJ — Brazilian Jiu-Jitsu, Bellaire, Texas",
  description: "A modern Brazilian Jiu-Jitsu academy in Bellaire, Texas. Train with 2010 IBJJF Black Belt World Champion Pablo Silva.",
  ogImage: "/images/hero-competition.jpg",
  instagram: "https://instagram.com/pablosilvabjjhq",
  youtube: "",
  footerCredit: "© Pablo Silva BJJ · Bellaire, Texas",
};

export function getHero(): HeroData {
  const raw = getSite<any>("hero", DEFAULT_HERO);
  return normalizeHero(raw);
}

export function getMarquee(): string[] {
  return getSite<string[]>("marquee", ["Confidence", "Self-Defense", "Discipline", "Respect"]);
}

export function getPhilosophy(): PhilosophyData {
  return getSite<PhilosophyData>("philosophy", DEFAULT_PHILOSOPHY);
}

export function getVisit(): VisitData {
  return getSite<VisitData>("visit", DEFAULT_VISIT);
}

export function getContact(): ContactData {
  return getSite<ContactData>("contact", DEFAULT_CONTACT);
}

export function getMeta(): MetaData {
  return getSite<MetaData>("meta", DEFAULT_META);
}

export function getPrograms(): Program[] {
  return (db.prepare(
    `SELECT * FROM programs WHERE visible = 1 ORDER BY sort ASC, id ASC`
  ).all() as Program[]).map(p => ({
    ...p,
    details: p.details_json ? JSON.parse(p.details_json) : [],
  }));
}

export function getProgramBySlug(slug: string): Program | null {
  const r = db.prepare(
    `SELECT * FROM programs WHERE slug = ? AND visible = 1`
  ).get(slug) as Program | undefined;
  if (!r) return null;
  return { ...r, details: r.details_json ? JSON.parse(r.details_json) : [] };
}

export function getInstructors(): Instructor[] {
  return (db.prepare(
    `SELECT * FROM instructors WHERE visible = 1 ORDER BY sort ASC, id ASC`
  ).all() as Instructor[]).map(i => ({
    ...i,
    tags: i.tags_json ? JSON.parse(i.tags_json) : [],
  }));
}

export function getGallery(): GalleryItem[] {
  return db.prepare(
    `SELECT * FROM gallery_items WHERE visible = 1 ORDER BY sort ASC, id ASC`
  ).all() as GalleryItem[];
}

export function getTestimonials(): Testimonial[] {
  return db.prepare(
    `SELECT * FROM testimonials WHERE visible = 1 ORDER BY sort ASC, id ASC`
  ).all() as Testimonial[];
}

export function getFAQ(): FAQItem[] {
  return db.prepare(
    `SELECT * FROM faq WHERE visible = 1 ORDER BY sort ASC, id ASC`
  ).all() as FAQItem[];
}

export function getHours(): HoursItem[] {
  return db.prepare(
    `SELECT * FROM hours WHERE visible = 1 ORDER BY sort ASC, id ASC`
  ).all() as HoursItem[];
}

export function getNavLinks(): NavLink[] {
  return db.prepare(
    `SELECT * FROM nav_links ORDER BY sort ASC, id ASC`
  ).all() as NavLink[];
}

export function getInstagramFeed(): InstagramFeedItem[] {
  const raw = getSite<InstagramFeedItem[] | unknown>("instagram_feed", DEFAULT_INSTAGRAM_FEED);
  if (!Array.isArray(raw)) return DEFAULT_INSTAGRAM_FEED;
  return raw
    .filter((x): x is InstagramFeedItem => !!x && typeof (x as { url?: unknown }).url === "string")
    .map(x => ({ url: x.url, caption: typeof x.caption === "string" ? x.caption : "" }));
}
