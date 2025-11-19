import Section from "app/components/section/Section";
import { BooksGroup } from "../components/books-group/BooksGroup";
import { Suspense } from "react";
import Loading from "../components/loading/Loading";

export default function BooksPage() {
  return (
    <Section classname="flex flex-col-reverse gap-8 lg:flex-row">
      <Suspense fallback={<Loading size="lg" text="Loading books..." />}>
        <BooksGroup />
      </Suspense>
    </Section>
  );
}
