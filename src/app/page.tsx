import Hero from "./components/hero/Hero";
import Section from "./components/section/Section";
import TestimonialGroup from "./components/testimonials/Testimonials";
import testimonials from "./data/testimonials.json";
import heroData from "./data/hero-content.json";

export default function Home() {
  const { "featured-book": featuredBook } = heroData;

  return (
    <>
      <Section>
        <Hero {...featuredBook} />
      </Section>
      <Section>
        <TestimonialGroup testimonials={testimonials} />
      </Section>
    </>
  );
}
