export type CTA = { label: string; href: string };

export type ValueItem = { title: string; body: string };

export type Social = { label: string; href: string };

export type HeroData = {
  eyebrow: string;
  titleLines: string[];
  subtitle: string;
  ctaPrimary: CTA;
  ctaSecondary: CTA;
  social: Social[];
  values: ValueItem[];
  portrait: string;
};

export type PhilosophyData = {
  eyebrow: string;
  title: string;
  italic: string;
  body: string[];
  image: string;
};

export type VisitData = {
  eyebrow: string;
  title: string;
  italic: string;
  body: string;
  address: string;
  mapUrl: string;
  image: string;
};

export type ContactData = {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  phone: string;
  whatsapp: string;
};

export type MetaData = {
  title: string;
  description: string;
  ogImage: string;
  instagram: string;
  youtube: string;
  footerCredit: string;
};

/** Backwards compat shims for the few legacy consumers still using old field names. */
export function normalizeHero<T extends Partial<HeroData> & { line1?: string; line2?: string; line3?: string; lede?: string; primaryCta?: CTA; secondaryCta?: CTA; stats?: { dt: string; dd: string }[]; backgroundImage?: string }>(raw: T): HeroData {
  const out: HeroData = {
    eyebrow: raw.eyebrow ?? "",
    titleLines: raw.titleLines && raw.titleLines.length
      ? raw.titleLines
      : [raw.line1 ?? "", raw.line2 ?? "", raw.line3 ?? ""].filter(Boolean),
    subtitle: raw.subtitle ?? raw.lede ?? "",
    ctaPrimary: raw.ctaPrimary ?? raw.primaryCta ?? { label: "", href: "" },
    ctaSecondary: raw.ctaSecondary ?? raw.secondaryCta ?? { label: "", href: "" },
    social: raw.social ?? [],
    values: raw.values ?? [],
    portrait: raw.portrait ?? raw.backgroundImage ?? "",
  };
  return out;
}

export type Program = {
  id: string;
  slug: string;
  sort: number;
  title: string;
  /** Displayed under the title in italic */
  tagline: string;
  /** Age range label */
  ageRange: string;
  image: string | null;
  /** Short summary */
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaLabel2?: string | null;
  ctaHref2?: string | null;
  details_json: string | null;
  visible: number;
  updated_at: number;
  details?: (string | { kind: "image" | "instagram" | "youtube" | "vimeo"; url: string; aspect: string })[];
};

export type Instructor = {
  id: string;
  sort: number;
  name: string;
  role: string | null;
  image: string | null;
  bio: string | null;
  tags_json: string | null;
  visible: number;
  updated_at: number;
  tags?: string[];
};

export type GalleryItem = {
  id: string;
  sort: number;
  kind: "image" | "instagram" | "video";
  url: string;
  caption: string | null;
  width: "sm" | "md" | "lg" | null;
  visible: number;
  updated_at: number;
};

export type Testimonial = {
  id: string;
  sort: number;
  quote: string;
  name: string;
  role: string | null;
  visible: number;
  updated_at: number;
};

export type FAQItem = {
  id: string;
  sort: number;
  question: string;
  answer: string;
  visible: number;
  updated_at: number;
};

export type HoursItem = {
  id: string;
  day: string;
  hours: string;
  sort: number;
  visible: number;
};

export type NavLink = {
  id: string;
  sort: number;
  label: string;
  href: string;
};

export type InstagramFeedItem = {
  url: string;
  caption: string;
};
