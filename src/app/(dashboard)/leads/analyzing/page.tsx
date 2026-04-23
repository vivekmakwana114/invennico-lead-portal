"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, Loader2 } from "lucide-react";

const STEPS = [
  {
    label: "Analyzing Lead",
    description: "AI is reading and understanding the requirements",
  },
  {
    label: "Extracting Details",
    description: "Identifying key information and technical needs",
  },
  {
    label: "Generating Cost Estimate",
    description: "Calculating budget and timeline ranges",
  },
  {
    label: "Preparing CRM Entry",
    description: "Creating structured data for Zoho sync",
  },
];

const STEP_DURATION = 1200; // ms per step
const REDIRECT_DELAY = 600; // ms after all steps complete

export default function AnalyzingPage() {
  const router = useRouter();
  // progress = number of completed steps (also = index of the active step)
  const [progress, setProgress] = useState(0);
  const allDone = progress >= STEPS.length;

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setProgress(i + 1), (i + 1) * STEP_DURATION)
    );

    const redirect = setTimeout(
      () => router.push("/leads"),
      STEPS.length * STEP_DURATION + REDIRECT_DELAY
    );

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(redirect);
    };
  }, [router]);

  const barWidth = `${(progress / STEPS.length) * 100}%`;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-xl bg-white border border-border rounded-3xl p-6 sm:p-10 shadow-sm">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles size={30} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Processing Your Lead
        </h1>
        <p className="text-sm text-ternary text-center mb-8">
          Our AI is analyzing the requirements and generating insights...
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step, i) => {
            const isCompleted = i < progress;
            const isActive = i === progress && !allDone;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-500 ${
                  isCompleted
                    ? "bg-success-bg border-success-border"
                    : isActive
                    ? "bg-error-bg border-error-border"
                    : "bg-white border-border"
                }`}
              >
                {/* Step icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isCompleted
                      ? "bg-success-text"
                      : isActive
                      ? "bg-primary"
                      : "bg-off-white"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} className="text-white" />
                  ) : isActive ? (
                    <Loader2 size={16} className="text-white animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-border" />
                  )}
                </div>

                {/* Step text */}
                <div>
                  <p
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      isCompleted
                        ? "text-success-text"
                        : isActive
                        ? "text-primary"
                        : "text-ternary"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-ternary mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-2 rounded-full bg-border overflow-hidden mb-2.5">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: barWidth }}
            />
          </div>
          <p className="text-sm text-ternary text-center">
            {allDone
              ? "Complete! Redirecting..."
              : `Processing... ${progress} of ${STEPS.length}`}
          </p>
        </div>
      </div>
    </div>
  );
}
