"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const STEPS = [
  { label: "Analyzing Lead",           description: "AI is reading and understanding the requirements" },
  { label: "Extracting Details",       description: "Identifying key information and technical needs" },
  { label: "Generating Cost Estimate", description: "Calculating budget and timeline ranges" },
  { label: "Saving to Portal",         description: "Persisting lead and consuming one analysis credit" },
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const allDone = progress >= STEPS.length;
  // Prevents React StrictMode's double-mount from firing the API call twice
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];

    async function run() {
      try {
        const dataStr = sessionStorage.getItem("pending_lead_data");
        if (!dataStr) { router.push("/leads"); return; }

        const pending = JSON.parse(dataStr);
        setProgress(1);

        // Animate through early steps while the backend handles AI + save
        timers.push(setTimeout(() => setProgress(2), 3000));
        timers.push(setTimeout(() => setProgress(3), 6500));

        const createRes = await api.post("/v1/leads", {
          title: pending.title,
          details: pending.details,
          source: pending.source.toLowerCase(),
          notes: pending.notes || null,
          attachments: Array.isArray(pending.attachments) ? pending.attachments : [],
          pdfContent: pending.pdfContent || null,
          isAnalyzed: true,
        });

        timers.forEach(clearTimeout);

        const savedLead = createRes.data?.data?.lead;
        setProgress(3);
        sessionStorage.removeItem("pending_lead_data");

        await new Promise((r) => setTimeout(r, 400));
        setProgress(4);

        setTimeout(() => router.push(`/leads/${savedLead.id}`), 500);

      } catch (err: any) {
        timers.forEach(clearTimeout);
        const msg = err.response?.data?.message || err.message || "Unknown error";
        setError(`Failed to analyze lead: ${msg}`);
      }
    }

    run();
    return () => { timers.forEach(clearTimeout); };
  }, [router]);

  const barWidth = `${(progress / STEPS.length) * 100}%`;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-xl bg-white border border-border rounded-3xl p-6 sm:p-10 shadow-sm">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles size={30} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Processing Your Lead</h1>
        <p className="text-sm text-ternary text-center mb-8">
          Our AI is analyzing the requirements and generating insights...
        </p>

        {error && (
          <div className="mb-6 p-4 text-sm text-error-text bg-error-bg border border-error-border rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-8">
          {STEPS.map((step, i) => {
            const isCompleted = i < progress;
            const isActive = i === progress && !allDone;
            return (
              <div
                key={step.label}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-500 ${
                  isCompleted ? "bg-success-bg border-success-border"
                  : isActive ? "bg-error-bg border-error-border"
                  : "bg-white border-border"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isCompleted ? "bg-success-text" : isActive ? "bg-primary" : "bg-off-white"
                }`}>
                  {isCompleted ? <Check size={16} className="text-white" />
                  : isActive ? <Loader2 size={16} className="text-white animate-spin" />
                  : <span className="w-2 h-2 rounded-full bg-border" />}
                </div>
                <div>
                  <p className={`text-sm font-semibold transition-colors duration-300 ${
                    isCompleted ? "text-success-text" : isActive ? "text-primary" : "text-ternary"
                  }`}>{step.label}</p>
                  <p className="text-xs text-ternary mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="h-2 rounded-full bg-border overflow-hidden mb-2.5">
            <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: barWidth }} />
          </div>
          <p className="text-sm text-ternary text-center">
            {allDone ? "Complete! Redirecting..." : `Processing... ${progress} of ${STEPS.length}`}
          </p>
        </div>
      </div>
    </div>
  );
}
