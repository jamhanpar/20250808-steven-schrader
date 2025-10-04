"use client";

import { useEffect, useRef, useState } from "react";

interface HeaderData {
  tagline: string;
  title: string;
  subtitle: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  mockup: string;
}

interface Config {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    danger: string;
  };
  animation: {
    scrollDuration: number;
    stepDuration: number;
    contentDuration: number;
    contentDelay: number;
  };
  viewport: {
    visibilityTop: number;
    visibilityBottom: number;
    center: number;
  };
}

interface TimelineProps {
  headerData?: HeaderData;
  steps?: Step[];
  config?: Config;
}

function SignupFormMockup({ config }: { config: Config }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-100 rounded border"></div>
          <div className="h-10 bg-gray-100 rounded border"></div>
        </div>
        <button
          className={`w-full bg-${config.colors.primary} hover:bg-${config.colors.primaryHover}`}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

function DesignSubmissionMockup({ config }: { config: Config }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      <div className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-16 h-16 bg-black rounded-lg transform rotate-12"></div>
          <div className="w-12 h-16 bg-gray-300 rounded transform -rotate-6 -ml-4"></div>
        </div>
        <button
          className={`w-full bg-${config.colors.primary} hover:bg-${config.colors.primaryHover}`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function CommunityVotingMockup({ config }: { config: Config }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 bg-${config.colors.accent} rounded-full`}
          ></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div
          className={`bg-${config.colors.danger} text-white px-3 py-1 rounded-full text-sm inline-flex items-center`}
        >
          ❤️ 42 votes
        </div>
      </div>
    </div>
  );
}

const defaultConfig: Config = {
  colors: {
    primary: "blue-600",
    primaryHover: "blue-700",
    secondary: "gray-400",
    accent: "pink-100",
    danger: "red-500",
  },
  animation: {
    scrollDuration: 300,
    stepDuration: 500,
    contentDuration: 700,
    contentDelay: 200,
  },
  viewport: {
    visibilityTop: 0.2,
    visibilityBottom: 0.8,
    center: 0.5,
  },
};

export function Timeline({
  headerData,
  steps,
  config = defaultConfig,
}: TimelineProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !steps) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight * config.viewport.center;

      const progress = Math.max(
        0,
        Math.min(1, (viewportCenter - containerRect.top) / containerRect.height)
      );
      setScrollProgress(progress);

      const stepIndex = Math.floor(progress * steps.length);
      const clampedIndex = Math.max(0, Math.min(steps.length - 1, stepIndex));

      const newVisibleSteps = new Set<number>();
      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (
            rect.top < window.innerHeight * config.viewport.visibilityBottom &&
            rect.bottom > window.innerHeight * config.viewport.visibilityTop
          ) {
            newVisibleSteps.add(index);
          }
        }
      });
      setVisibleSteps(newVisibleSteps);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [config.viewport, steps]);

  const renderMockup = (mockupType: string) => {
    switch (mockupType) {
      case "signup-form":
        return <SignupFormMockup config={config} />;
      case "design-submission":
        return <DesignSubmissionMockup config={config} />;
      case "community-voting":
        return <CommunityVotingMockup config={config} />;
      default:
        return null;
    }
  };

  // Function to smoothly scroll to a specific step
  const scrollToStep = (stepIndex: number) => {
    const targetStep = stepRefs.current[stepIndex];
    if (targetStep) {
      const offsetTop = targetStep.offsetTop - window.innerHeight * 0.2; // Add some padding from top

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Calculate the height where the last step circle should be
  const calculateProgressBarHeight = () => {
    if (!steps) return "100%";
    const totalSteps = steps.length;
    if (totalSteps === 0) return "100%";

    // Each step takes up roughly equal space, so the last step circle
    // should be at approximately (totalSteps - 0.5) / totalSteps of the total height
    const lastStepPosition = ((totalSteps - 0.5) / totalSteps) * 100;
    return `${lastStepPosition}%`;
  };

  const maxProgressHeight = calculateProgressBarHeight();

  // Early return if no steps provided
  if (!steps || steps.length === 0) {
    return (
      <section className="relative bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-gray-500">No timeline steps provided</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p
              className={`text-sm font-medium text-${config.colors.primary} uppercase tracking-wider`}
            >
              {headerData?.tagline}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
              {headerData?.title}
            </h1>
            <p className="text-lg text-gray-600">{headerData?.subtitle}</p>
          </div>

          <div className="relative flex flex-col gap-4">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div
              className={`absolute left-4 top-0 w-0.5 bg-${config.colors.primary} transition-all ease-out`}
              style={{
                height: `${Math.min(100, scrollProgress * 100)}%`,
                transitionDuration: `${config.animation.scrollDuration}ms`,
              }}
            ></div>
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex items-center mb-8 last:mb-0 gap-4"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold relative z-10 transition-all ${
                    scrollProgress >= (index + 1) / steps.length
                      ? `bg-${config.colors.primary} scale-110`
                      : `bg-${config.colors.secondary}`
                  }`}
                  style={{
                    transitionDuration: `${config.animation.scrollDuration}ms`,
                  }}
                >
                  •
                </div>
                <div className="ml-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    STEP {step.number}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[300vh] relative">
        {/*--- Static Progress Bar ---*/}
        {/* <div
          className="absolute left-1/2 top-0 w-0.5 bg-gray-300 hidden lg:block"
          style={{ height: "100%" }}
        ></div> */}
        <div
          className="absolute left-1/2 top-0 w-0.5 bg-gray-300 hidden lg:block"
          style={{ height: calculateProgressBarHeight() }}
        ></div>
        {/*--- Dynamic Progress Bar ---*/}
        <div
          className={`absolute left-1/2 top-0 w-0.5 bg-${config.colors.primary} transition-all ease-out hidden lg:block`}
          style={{
            height: `${Math.min(
              scrollProgress * 100,
              parseFloat(maxProgressHeight)
            )}%`,
            transitionDuration: `${config.animation.stepDuration}ms`,
          }}
        ></div>

        {steps.map((step, index) => (
          <div
            key={step.number}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
            className="min-h-screen flex items-center py-20"
          >
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div
                  className={`order-2 lg:order-1 transition-all ease-out ${
                    visibleSteps.has(index)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-8"
                  }`}
                  style={{
                    transitionDuration: `${config.animation.contentDuration}ms`,
                  }}
                >
                  {renderMockup(step.mockup)}
                </div>

                <div className="order-1 lg:order-2 relative">
                  <div className="flex items-start space-x-6 gap-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10 transition-all ${
                        visibleSteps.has(index)
                          ? `bg-${config.colors.primary} scale-100`
                          : `bg-${config.colors.secondary} scale-90`
                      }`}
                      style={{
                        transitionDuration: `${config.animation.stepDuration}ms`,
                      }}
                    >
                      •
                    </div>
                    <div
                      className={`space-y-4 flex-1 transition-all ease-out ${
                        visibleSteps.has(index)
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-8"
                      }`}
                      style={{
                        transitionDuration: `${config.animation.contentDuration}ms`,
                        transitionDelay: `${config.animation.contentDelay}ms`,
                      }}
                    >
                      <p
                        className={`text-sm text-${config.colors.primary} uppercase tracking-wider font-medium`}
                      >
                        {step.number}
                      </p>
                      <h2 className="text-3xl lg:text-4xl font-bold">
                        {step.title}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
