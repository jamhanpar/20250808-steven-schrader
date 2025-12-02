import React from "react";

export interface Testimonial {
  name: string;
  title?: string;
  message: string;
  avatarUrl?: string;
}

export interface TestimonialGroupProps {
  testimonials: Testimonial[];
  heading?: string;
}

const TestimonialGroup: React.FC<TestimonialGroupProps> = ({
  testimonials,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between gap-4 bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <p
              className="text-black italic mb-4"
              dangerouslySetInnerHTML={{ __html: `"${t.message}"` }}
            />
            <div className="flex flex-col gap-2 text-center">
              <span className="font-semibold">{t.name}</span>
              {t.title && (
                <span
                  className="block text-sm text-gray-500"
                  dangerouslySetInnerHTML={{ __html: t.title }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialGroup;
