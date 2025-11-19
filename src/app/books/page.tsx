import Section from "app/components/section/Section";
import { BooksGroup } from "../components/books-group/BooksGroup";

export default function BooksPage() {
  return (
    <Section classname="flex flex-col-reverse gap-8 lg:flex-row">
      <BooksGroup />
    </Section>
  );
}
