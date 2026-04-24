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

  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function analyzeLead() {
      try {
        const dataStr = sessionStorage.getItem("pending_lead_data");
        if (!dataStr) {
          router.push("/leads");
          return;
        }
        
        const pendingLead = JSON.parse(dataStr);
        
        // Visually we are at step 1: Extracting
        setProgress(1);
        
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingLead),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.detail || errBody.error || `API error ${res.status}`);
        }
        
        const aiData = await res.json();
        if (isCancelled) return;
        
        setProgress(2); // Generating Cost Estimate
        
        const pocId = `LD-POC-${Math.floor(Math.random() * 10000)}`;
        
        // Merge the AI data into the LeadDetail format
        const mergedLead = {
          id: pocId,
          status: "new",
          fullProjectName: pendingLead.title || "Untitled Project",
          dateReceived: new Date().toISOString().split("T")[0],
          source: pendingLead.source || "Direct",
          clientContact: "POC Client",
          leadSummary: aiData.lead_summary || "No summary provided.",
          aiQualification: {
            score: aiData.qualification?.score || 0,
            label: aiData.qualification?.label || "Unknown",
            description: aiData.qualification?.reasoning || "No reasoning.",
            nextAction: aiData.recommended_next_action || "Review manually.",
            handoffNote: "AI generated analysis via POC.",
          },
          techStack: {
            frontend: aiData.recommended_tech_stack?.frontend || [],
            backend: [
              ...(aiData.recommended_tech_stack?.backend || []),
              ...(aiData.recommended_tech_stack?.database || []),
            ],
            integrations: aiData.recommended_tech_stack?.integrations || [],
            hosting: aiData.recommended_tech_stack?.hosting || [],
          },
          timeline: aiData.estimation?.timeline || "N/A",
          budget: aiData.estimation?.budget_range || "N/A",
          milestones: (aiData.estimation?.breakdown || []).map((b: { phase?: string; timeline?: string; cost_range?: string }) => ({
            name: b.phase || "Phase",
            duration: b.timeline || "N/A",
            cost: b.cost_range || "N/A",
          })),
          suggestedQuestions: aiData.suggested_questions || [],
          auditLog: [
            { label: "Lead Created", date: new Date().toLocaleDateString(), actor: "System" },
            { label: "AI Analysis Complete", date: new Date().toLocaleDateString(), actor: "AI Bot" }
          ],
          // original data passed to use in whatsapp
          originalLeadDetails: pendingLead.details
        };

        sessionStorage.setItem(`lead_${pocId}`, JSON.stringify(mergedLead));

        setProgress(3); // Preparing CRM Entry
        await new Promise(r => setTimeout(r, 600)); 
        setProgress(4); // All done
        
        setTimeout(() => {
          if (!isCancelled) router.push(`/leads/${pocId}`);
        }, 500);

      } catch (err) {
        console.error(err);
        if (!isCancelled) setError("Failed to analyze lead. Please check your ANTHROPIC_API_KEY and try again.");
      }
    }

    analyzeLead();

    return () => {
      isCancelled = true;
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

        {error && (
          <div className="mb-6 p-4 text-sm text-error-text bg-error-bg border border-error-border rounded-xl">
            {error}
          </div>
        )}

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
