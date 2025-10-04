import React from "react";

// Type for a single testimonial
export interface Testimonial {
  name: string;
  title?: string;
  message: string;
  avatarUrl?: string;
}

// Props for the group component
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
            className="flex flex-col justify-between gap-4 bg-white p-6 rounded shadow hover:shadow-lg transition"
          >
            <p className="text-gray-700 italic mb-4">“{t.message}”</p>
            <div className="flex flex-col gap-2 text-center">
              <span className="font-semibold">{t.name}</span>
              {t.title && (
                <span className="block text-sm text-gray-500">{t.title}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialGroup;
