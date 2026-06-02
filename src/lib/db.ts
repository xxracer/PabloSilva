import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "cms.db");

// Ensure data dir exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Singleton across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function open(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export const db: Database.Database = global.__db ?? open();
if (process.env.NODE_ENV !== "production") global.__db = db;

// ─── Schema ─────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS site (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL,
    ageRange TEXT NOT NULL DEFAULT '',
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image TEXT,
    ctaLabel TEXT NOT NULL DEFAULT 'Book a Trial',
    ctaHref TEXT NOT NULL DEFAULT '/contact',
    ctaLabel2 TEXT,
    ctaHref2 TEXT,
    details_json TEXT,
    visible INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS instructors (
    id TEXT PRIMARY KEY,
    sort INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    role TEXT,
    image TEXT,
    bio TEXT,
    tags_json TEXT,
    visible INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS gallery_items (
    id TEXT PRIMARY KEY,
    sort INTEGER NOT NULL DEFAULT 0,
    kind TEXT NOT NULL,                -- 'image' | 'instagram' | 'video'
    url TEXT NOT NULL,                 -- local path or external embed URL
    caption TEXT,
    width TEXT,                        -- 'sm' | 'md' | 'lg' for asymmetric grid
    visible INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    sort INTEGER NOT NULL DEFAULT 0,
    quote TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    role TEXT,
    visible INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS faq (
    id TEXT PRIMARY KEY,
    sort INTEGER NOT NULL DEFAULT 0,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    visible INTEGER NOT NULL DEFAULT 1,
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS hours (
    id TEXT PRIMARY KEY,
    day TEXT NOT NULL,
    hours TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    visible INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS nav_links (
    id TEXT PRIMARY KEY,
    sort INTEGER NOT NULL DEFAULT 0,
    label TEXT NOT NULL,
    href TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS uploads (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT,
    mime TEXT,
    size INTEGER,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS _meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// ─── Helpers ────────────────────────────────────────────────────
export type Row = Record<string, unknown>;

export function getSite<T = unknown>(key: string, fallback: T): T {
  const r = db.prepare("SELECT value FROM site WHERE key = ?").get(key) as { value: string } | undefined;
  if (!r) return fallback;
  try { return JSON.parse(r.value) as T; } catch { return fallback; }
}
export function setSite(key: string, value: unknown): void {
  db.prepare(
    `INSERT INTO site (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(key, JSON.stringify(value));
}

// ─── Seed defaults (idempotent) ─────────────────────────────────
const SEED_VERSION = "1";
function seed() {
  // Fast exit if this seed version has already been applied to the DB.
  // Prevents the concurrent build workers from racing on UNIQUE constraints.
  const v = db
    .prepare("SELECT value FROM _meta WHERE key = 'seed_version'")
    .get() as { value: string } | undefined;
  if (v?.value === SEED_VERSION) return;

  // BEGIN IMMEDIATE acquires the write lock up-front so concurrent workers
  // serialize rather than collide on unique-key inserts.
  db.exec("BEGIN IMMEDIATE");
  try {
  // Wipe the old hero eyebrow if it leaked in from a prior seed.
  const heroRow = db.prepare("SELECT value FROM site WHERE key = 'hero'").get() as { value: string } | undefined;
  if (heroRow) {
    try {
      const obj = JSON.parse(heroRow.value);
      if (typeof obj.eyebrow === "string" && obj.eyebrow.toLowerCase().includes("bellaire")) {
        obj.eyebrow = "";
        db.prepare("UPDATE site SET value = ? WHERE key = 'hero'").run(JSON.stringify(obj));
      }
    } catch {}
  }

  // Sync nav_links to the current order (idempotent upsert — safe under
  // concurrent build workers that all run the seed on first import).
  const expectedNav: [string, number, string, string][] = [
    ["n-1", 0, "Programs", "/programs"],
    ["n-2", 1, "Instructors", "/instructors"],
    ["n-3", 2, "Schedule", "/schedule"],
    ["n-4", 3, "Visit", "/contact"],
  ];
  const navIns = db.prepare(
    `INSERT INTO nav_links (id, sort, label, href) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET sort = excluded.sort, label = excluded.label, href = excluded.href`
  );
  for (const r of expectedNav) navIns.run(...r);
  // Drop any extra nav rows that are no longer in the expected set.
  db.prepare(`DELETE FROM nav_links WHERE id NOT IN (${expectedNav.map(() => "?").join(",")})`)
    .run(...expectedNav.map((r) => r[0]));

  const site = db.prepare("SELECT COUNT(*) as c FROM site").get() as { c: number };
  if (site.c === 0) {
    const defaults: Record<string, unknown> = {
      hero: {
        eyebrow: "",
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
      },
      marquee: ["Confidence", "Self-Defense", "Discipline", "Respect"],
      philosophy: {
        eyebrow: "01 Philosophy",
        title: "A quiet art,",
        italic: "practiced seriously.",
        body: [
          "At Pablo Silva BJJ we don't promise shortcuts. We promise a thoughtful place to train — refined coaching, premium facilities, and a community that takes the art, and each other, seriously.",
          "In our world-class academy you'll find a clean mat space, a dedicated strength and conditioning room, and personalized instruction from <strong>2010 IBJJF Black Belt World Champion Pablo Silva</strong>. Our classes will challenge you, sharpen your technique, build real confidence, and put you in the best shape of your life.",
          "Men, women, and children from age three upwards train here. Whether your goal is competition, self-defense, or simply a calmer, stronger version of yourself — there is a place for you on the mat.",
        ],
        image: "/images/training-1.jpg",
      },
      visit: {
        eyebrow: "06 Visit",
        title: "Schedule a",
        italic: "visit.",
        body:
          "See the facility. Meet the coaches. Watch a class. Your first session is on us — no pressure, no commitment, just a chance to feel the room.",
        address: "5233 Bellaire Blvd, Bellaire, TX 77401",
        mapUrl: "https://maps.google.com/?q=5233+Bellaire+Blvd+Bellaire+TX",
        image: "/images/gi-detail.jpg",
      },
      contact: {
        eyebrow: "07 Contact",
        title: "Say hello.",
        body: "Questions about programs, scheduling, or a private session? Reach out — we usually reply within a day.",
        email: "pablosilvabjj@gmail.com",
        phone: "+1 (346) 303-9572",
        whatsapp: "13463039572",
      },
      meta: {
        title: "Pablo Silva BJJ — Brazilian Jiu-Jitsu, Bellaire, Texas",
        description: "A modern Brazilian Jiu-Jitsu academy in Bellaire, Texas. Train with 2010 IBJJF Black Belt World Champion Pablo Silva.",
        ogImage: "/images/hero-competition.jpg",
        instagram: "https://instagram.com/pablosilvabjjhq",
        youtube: "",
        footerCredit: "© Pablo Silva BJJ · Bellaire, Texas",
      },
    };
    const ins = db.prepare("INSERT INTO site (key, value) VALUES (?, ?)");
    const tx = db.transaction((obj: typeof defaults) => {
      for (const [k, v] of Object.entries(obj)) ins.run(k, JSON.stringify(v));
    });
    tx(defaults);
  }

  const pCount = db.prepare("SELECT COUNT(*) as c FROM programs").get() as { c: number };
  if (pCount.c === 0) {
    const ins = db.prepare(
      `INSERT INTO programs (id, slug, sort, title, ageRange, tagline, description, image, ctaLabel, ctaHref, ctaLabel2, ctaHref2, details_json, visible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
    );
    const rows = [
      {
        id: "p-little", slug: "little-champions", sort: 0,
        title: "Little Champions", ageRange: "Ages 3–6",
        tagline: "Life-Long Skills for Our Youngest BJJ Enthusiasts!",
        description:
          "Our Little Champions program, for kids ages 3-6, focuses on developing a strong foundation necessary for BJJ. In addition to teaching jiu-jitsu techniques, we have a special facility with all types of equipment to help these little ones work on developing their strength, balance/coordination, motor skills, and agility.",
        image: "/images/programs/little-champs.png",
        ctaLabel: "Book A Trial", ctaHref: "/contact",
        ctaLabel2: null, ctaHref2: null,
        details: [
          "45-minute classes, 2× per week",
          "Strength, balance, and coordination drills",
          "Listening and motor-skill development",
          "Play-based introduction to BJJ language",
          "Parent observation welcome",
        ],
      },
      {
        id: "p-champions", slug: "champions-and-teens", sort: 1,
        title: "Champions And Teens", ageRange: "Ages 7–16",
        tagline: "Building Confidence and Technique in Young Athletes!",
        description:
          "Our kids' programs focus on teaching classic and modern BJJ. We encourage competition as it pushes the kids outside their comfort zone and encourages them to be the best version of themselves. Pablo stresses the importance of commitment, discipline, and hard work when it comes to succeeding in jiu-jitsu.",
        image: "/images/programs/champions.jpg",
        ctaLabel: "Book a Trial — Champions (7–10)", ctaHref: "/contact",
        ctaLabel2: "Book a Trial — Teens (11–16)", ctaHref2: "/contact",
        details: [
          "Classic and modern BJJ curriculum",
          "Encourages competition and stepping outside the comfort zone",
          "Commitment, discipline, and hard work as core values",
          "Age-appropriate groupings (7–10 and 11–16)",
          "Pathway to the Kids Competition team",
        ],
      },
      {
        id: "p-kidscomp", slug: "kids-competition", sort: 2,
        title: "Kids Competition", ageRange: "Competition Team",
        tagline: "Prepare Your Child for Success in Competitive BJJ!",
        description:
          "For those kids looking to take their jiu-jitsu to the next level, we offer our Kids Competition Program. With the Kids Competition Package, your child will have the option to attend 7 classes a week! Kids enrolled in the Competition Program receive more detailed instruction on competition-tested techniques as well as strength and conditioning classes on our second floor both in a small group format. The Competition Program is a fast-track and surefire way to increase your child's confidence, strength, coordination, and jiu-jitsu knowledge.",
        image: "/images/programs/kids-competition.png",
        ctaLabel: "Apply for Competition Team", ctaHref: "/contact",
        ctaLabel2: null, ctaHref2: null,
        details: [
          "Up to 7 classes per week",
          "Detailed instruction on competition-tested techniques",
          "Strength & conditioning on the second floor (small group)",
          "Fast-track to confidence, strength, and jiu-jitsu knowledge",
          "Travel to regional IBJJF, JJWL, and NAGA events",
        ],
      },
      {
        id: "p-adults", slug: "adults", sort: 3,
        title: "Adults BJJ", ageRange: "Men & Women · All Levels",
        tagline: "Master the Art and Elevate Your Game!",
        description:
          "We offer a wide array of classes for men and women suited to both beginners and advanced practitioners alike. Gi, fundamentals, and competition training — we offer it all! Whether your goal is to get in shape, learn BJJ, or become a world-class competitor, our team is ready to help.",
        image: "/images/programs/teens.jpg",
        ctaLabel: "Book A Trial", ctaHref: "/contact",
        ctaLabel2: null, ctaHref2: null,
        details: [
          "Fundamentals (Mon, Wed, Fri · 6:00 AM and 6:30 PM)",
          "Advanced (Tue, Thu · 6:30 PM)",
          "Open mat (Sat · 9:00 AM)",
          "Optional strength & conditioning add-on",
          "Open to all levels — beginner to competitor",
        ],
      },
    ];
    const tx = db.transaction(() => {
      for (const r of rows) {
        ins.run(
          r.id, r.slug, r.sort, r.title, r.ageRange, r.tagline, r.description,
          r.image, r.ctaLabel, r.ctaHref, r.ctaLabel2, r.ctaHref2,
          JSON.stringify(r.details)
        );
      }
    });
    tx();
  }

  const iCount = db.prepare("SELECT COUNT(*) as c FROM instructors").get() as { c: number };
  if (iCount.c === 0) {
    const ins = db.prepare(
      `INSERT INTO instructors (id, sort, name, role, image, bio, tags_json) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const rows = [
      {
        id: "i-pablo", sort: 0,
        name: "Pablo Silva", role: "Head Instructor · Founder",
        image: "/images/professor.jpg",
        bio: "2010 IBJJF Black Belt World Champion. Pablo leads every program with patient, sharp detail and decades of competitive experience.",
        tags: ["Black belt", "IBJJF World Champion", "20+ yrs"],
      },
      {
        id: "i-felipe", sort: 1,
        name: "Coach Felipe", role: "Adults BJJ · Competition",
        image: "/images/training-1.jpg",
        bio: "Brown belt under Pablo with a competition record across IBJJF and NAGA. Specializes in leg-lock systems and no-gi.",
        tags: ["Brown belt", "Competition", "No-gi"],
      },
      {
        id: "i-mariana", sort: 2,
        name: "Coach Mariana", role: "Women's & Teens",
        image: "/images/training-2.jpg",
        bio: "Purple belt and a fierce competitor in the women's division. Leads our women's open mat and teen fundamentals.",
        tags: ["Purple belt", "Women's program", "Teens"],
      },
      {
        id: "i-daniel", sort: 3,
        name: "Coach Daniel", role: "Little Champions",
        image: "/images/training-3.jpg",
        bio: "Brown belt, early-childhood educator, and father of three. Built our Little Champions curriculum from the ground up.",
        tags: ["Brown belt", "Kids curriculum", "Movement"],
      },
    ];
    const tx = db.transaction(() => {
      for (const r of rows) {
        ins.run(r.id, r.sort, r.name, r.role, r.image, r.bio, JSON.stringify(r.tags));
      }
    });
    tx();
  }

  const gCount = db.prepare("SELECT COUNT(*) as c FROM gallery_items").get() as { c: number };
  if (gCount.c === 0) {
    const ins = db.prepare(
      `INSERT INTO gallery_items (id, sort, kind, url, caption, width) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const rows = [
      { id: "g-1", sort: 0, kind: "image", url: "/images/hero-competition.jpg", caption: "2024 · IBJJF Waco Open", width: "lg" },
      { id: "g-2", sort: 1, kind: "image", url: "/images/training-1.jpg", caption: "Morning open mat", width: "sm" },
      { id: "g-3", sort: 2, kind: "image", url: "/images/training-2.jpg", caption: "Champions & Teens", width: "sm" },
      { id: "g-4", sort: 3, kind: "image", url: "/images/training-3.jpg", caption: "Little Champions class", width: "md" },
      { id: "g-5", sort: 4, kind: "image", url: "/images/gi-detail.jpg", caption: "Gi details", width: "sm" },
    ];
    const tx = db.transaction(() => {
      for (const r of rows) ins.run(r.id, r.sort, r.kind, r.url, r.caption, r.width);
    });
    tx();
  }

  const tCount = db.prepare("SELECT COUNT(*) as c FROM testimonials").get() as { c: number };
  if (tCount.c === 0) {
    const ins = db.prepare(
      `INSERT INTO testimonials (id, sort, quote, name, role, visible) VALUES (?, ?, ?, ?, ?, 1)`
    );
    ins.run("t-1", 0,
      "This gym has opened the doors for my son and me to the world of BJJ. Pablo and his coaches are honourable individuals who offer next-level training to all.",
      "Aluric Torres", "Parent & Member");
    ins.run("t-2", 1,
      "This gym is very welcoming to women and has many high-ranking women to work with — which can be difficult to find in BJJ.",
      "Amanda Hoffpauir", "Member");
  }

  const fCount = db.prepare("SELECT COUNT(*) as c FROM faq").get() as { c: number };
  if (fCount.c === 0) {
    const ins = db.prepare(
      `INSERT INTO faq (id, sort, question, answer) VALUES (?, ?, ?, ?)`
    );
    const rows = [
      ["f-1", 0, "Do I need experience?", "None at all. Most adults walk in for their first class with no martial arts background. We'll pair you with a coach for your first few sessions."],
      ["f-2", 1, "What should I bring?", "Just water and comfortable clothes (a t-shirt and shorts or joggers work fine for your first class). We have loaner gis if you decide to keep coming."],
      ["f-3", 2, "How long until I can compete?", "Most kids are ready for their first tournament after about six months of consistent training. Adults can compete at any stage — we have a competition team for that."],
      ["f-4", 3, "Do you offer a free trial?", "Yes — your first class is on us. Book a trial below and we'll set it up."],
    ];
    const tx = db.transaction(() => {
      for (const r of rows) ins.run(...r);
    });
    tx();
  }

  const hCount = db.prepare("SELECT COUNT(*) as c FROM hours").get() as { c: number };
  if (hCount.c === 0) {
    const ins = db.prepare(
      `INSERT INTO hours (id, day, hours, sort, visible) VALUES (?, ?, ?, ?, 1)`
    );
    ins.run("h-1", "Mon – Fri", "7:00 AM – 7:30 PM", 0);
    ins.run("h-2", "Saturday", "8:00 AM – 10:00 AM", 1);
    ins.run("h-3", "Sunday", "Closed", 2);
  }

  // nCount / nav links already synced above.

  // Mark the seed as applied for this version.
  db.prepare(
    `INSERT INTO _meta (key, value) VALUES ('seed_version', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(SEED_VERSION);

  db.exec("COMMIT");
  } catch (e) {
    // Another worker raced us and committed first — that's fine, just exit.
    try { db.exec("ROLLBACK"); } catch {}
  }
}

seed();
