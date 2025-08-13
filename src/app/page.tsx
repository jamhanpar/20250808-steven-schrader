import Hero from "./components/hero/Hero";
import Section from "./components/section/Section";
import TestimonialGroup from "./components/testimonials/Testimonials";
import testimonials from "./components/testimonials/testimonials.json";

export default function Home() {
  return (
    <>
      <Section>
        <Hero />
      </Section>
      <Section>
        <TestimonialGroup
          testimonials={testimonials}
          heading="What People Say"
        />
      </Section>
    </>
  );
}
