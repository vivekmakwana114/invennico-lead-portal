"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LeadDetail } from "@/components/leads/LeadsDetailData";

// ── Message generator ─────────────────────────────────────────────────────────

function generateMessage(lead: LeadDetail): string {
  const { fullProjectName, timeline, budget, techStack } = lead;
  const fe = techStack.frontend?.[0] ?? "our recommended framework";
  const be = techStack.backend?.[0] ?? "a robust backend";

  return `Hi there! 👋\n\nThanks so much for reaching out about your ${fullProjectName} project. We're really excited about this!\n\nWe've taken a look at your requirements and think this is a great fit for us. We're thinking ${fe} for the frontend, with a solid ${be} backend.\n\nHere's what we're estimating:\n⏱ Timeline: ${timeline}\n💰 Budget: ${budget}\n\nWould love to hop on a quick call to discuss further. When works for you?`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface WhatsAppReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadDetail;
}

export function WhatsAppReplyModal({ isOpen, onClose, lead }: WhatsAppReplyModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generate() {
      try {
        setLoading(true);
        const res = await fetch("/api/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_summary: lead.leadSummary,
            tech_stack: lead.techStack ? Object.values(lead.techStack).flat().join(", ") : "N/A",
            timeline: lead.timeline,
            budget: lead.budget,
            original_lead: lead.originalLeadDetails || lead.leadSummary
          })
        });
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();
        setMessage(data.message || generateMessage(lead));
      } catch (err) {
        console.error(err);
        setMessage("Failed to generate message via AI. \n\n" + generateMessage(lead));
      } finally {
        setLoading(false);
      }
    }
    
    if (isOpen) {
      generate();
    }
  }, [isOpen, lead]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-foreground">Draft WhatsApp Reply</h2>
              <p className="text-xs text-ternary mt-0.5 truncate">{lead.fullProjectName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ternary hover:bg-off-white hover:text-foreground transition-colors cursor-pointer shrink-0 mt-0.5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Message area */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">AI-Generated Message</p>
              <button
                onClick={() => setIsEditing((v) => !v)}
                className="text-sm font-medium text-primary hover:underline cursor-pointer"
              >
                {isEditing ? "Preview" : "Edit Response"}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                disabled={loading}
              />
            ) : (
              <div className="px-4 py-4 rounded-xl bg-off-white border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[160px]">
                {loading ? "Generating response..." : message}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border shrink-0">
          <Button
            label="Cancel"
            variant="secondary"
            className="px-5 py-2.5 text-sm"
            onClick={onClose}
          />
          <Button
            label={copied ? "Copied!" : "Copy to Clipboard"}
            icon={copied ? <Check size={15} /> : <Copy size={15} />}
            iconPlacement="left"
            variant="primary"
            className="px-5 py-2.5 text-sm"
            onClick={handleCopy}
          />
        </div>
      </div>
    </div>
  );
}
