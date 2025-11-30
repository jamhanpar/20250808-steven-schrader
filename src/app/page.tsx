import Hero from "./components/hero/Hero";
import Section from "./components/section/Section";
import TestimonialGroup from "./components/testimonials/Testimonials";
import testimonialsData from "./data/testimonials.json";
import heroData from "./data/hero-content.json";

export default function Home() {
  const { "featured-book": featuredBook } = heroData;
  const { testimonials: testimonials } = testimonialsData;

  return (
    <>
      <Section>
        <Hero {...featuredBook} />
      </Section>
      <Section title={testimonialsData.title}>
        <TestimonialGroup testimonials={testimonials} />
      </Section>
    </>
  );
}
