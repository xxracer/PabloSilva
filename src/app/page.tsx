import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Philosophy } from "@/components/philosophy";
import { Programs } from "@/components/programs";
import { Instructor } from "@/components/instructor";
import { Quotes } from "@/components/quotes";
import { Gallery } from "@/components/gallery";
import { InstagramFeed } from "@/components/instagram-feed";
import { Visit } from "@/components/visit";
import {
  getHero, getMarquee, getPhilosophy, getPrograms,
  getInstructors, getTestimonials, getGallery, getInstagramFeed, getVisit,
} from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Pablo Silva BJJ is a premium Brazilian Jiu-Jitsu academy in Bellaire, Texas, founded and led by 2010 IBJJF Black Belt World Champion Pablo Silva. Programs start at age 3 and continue through adult competition. Book a free trial.",
  openGraph: {
    title: "Pablo Silva BJJ — Where champions are made",
    description:
      "Brazilian Jiu-Jitsu academy in Bellaire, Texas, led by 2010 IBJJF World Champion Pablo Silva. Programs for kids, teens, and adults.",
  },
};

export default function HomePage() {
  const hero = getHero();
  const marquee = getMarquee();
  const philosophy = getPhilosophy();
  const programs = getPrograms();
  const instructors = getInstructors();
  const testimonials = getTestimonials();
  const gallery = getGallery();
  const instagram = getInstagramFeed();
  const visit = getVisit();

  return (
    <>
      <Hero data={hero} />
      <Marquee items={marquee} />
      <Philosophy data={philosophy} />
      <Programs programs={programs} />
      <Instructor instructors={instructors} />
      <Quotes items={testimonials} />
      <Gallery items={gallery} />
      <InstagramFeed items={instagram} />
      <Visit data={visit} />
    </>
  );
}
