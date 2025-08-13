import Mosaic from "app/components/mosaic/Mosaic";
import Section from "app/components/section/Section";
import Image from "next/image";

export default function BioPage() {
  return (
    <>
      <Section>
        <Mosaic
          images={["/images/steve-schrader-bio.png"]}
          columns={1}
          gap={8}
        />
      </Section>
      <Section>
        {/* Left: Profile and creative image grid */}
        <div className="flex flex-col gap-6 items-center md:w-1/2">
          {/* Main profile image */}
          <div className="rounded-full overflow-hidden border-4 border-primary shadow-lg w-40 h-40">
            <Image
              src="/images/steve-schrader-author.jpg"
              alt="Profile"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Creative image grid */}
          <div className="grid grid-cols-3 grid-rows-2 gap-2 w-64 h-40">
            <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/steve-schrader-author.jpg"
                alt="Creative 1"
                width={180}
                height={180}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/steve-schrader-profile.jpg"
                alt="Creative 2"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/steve-schrader-author.jpg"
                alt="Creative 3"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
        {/* Right: Bio text */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-primary mb-2">About Me</h1>
          <p className="text-lg text-foreground leading-relaxed">
            Steven Schrader was born in New York in 1935. He has been a dress
            salesman, a social worker, and a junior high and high school
            teacher. For ten years he was director of Teachers & Writers
            Collaborative, an arts organization that sends writers and other
            artists into schools and he is now the co-chair. He was the
            publisher of Cane Hill Press, which specialized in fiction. His work
            has been included in several anthologies and broadcast on National
            Public Radio’s Selected Shorts. He lives on New York’s Upper West
            Side, a strong presence in his stories, with his wife, Lucy
            Kostelanetz, a documentary film maker.
          </p>
          <p className="text-md text-muted-foreground">
            Outside of coding, you&apos;ll find me experimenting with
            photography, hiking, and learning new things every day.
          </p>
        </div>
      </Section>
    </>
  );
}
