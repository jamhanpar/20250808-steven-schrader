import Section from "app/components/section/Section";
import { BooksGroup } from "../components/books-group/BooksGroup";

interface BooksPageProps {
  searchParams: Promise<{ preview?: string }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { preview } = await searchParams;

  return (
    <Section classname="flex flex-col-reverse gap-8 lg:flex-row">
      <BooksGroup initialShowDetails={preview === "false" || preview === "0"} />
    </Section>
  );
}
