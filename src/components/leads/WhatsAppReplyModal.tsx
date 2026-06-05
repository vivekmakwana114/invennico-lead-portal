"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAppDispatch } from "@/state/hooks";
import { updateLead } from "@/state/leads/leadsSlice";
import type { LeadDetail } from "@/components/leads/LeadsDetailData";

type Mode2Phase = "input" | "generating" | "result";

interface WhatsAppReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadDetail;
}

export function WhatsAppReplyModal({ isOpen, onClose, lead }: WhatsAppReplyModalProps) {
  const dispatch = useAppDispatch();

  const [mode, setMode] = useState<1 | 2>(1);

  // Mode 1 state
  const [savedDraft, setSavedDraft] = useState("");
  const [mode1Loading, setMode1Loading] = useState(false);
  const [mode1Error, setMode1Error] = useState("");

  // Mode 2 state
  const [mode2Phase, setMode2Phase] = useState<Mode2Phase>("input");
  const [followUp, setFollowUp] = useState("");
  const [regenMessage, setRegenMessage] = useState("");
  const [mode2Error, setMode2Error] = useState("");
  const [draftCopied, setDraftCopied] = useState(false);
  const [regenCopied, setRegenCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Reset on every open
    setFollowUp("");
    setMode1Error("");
    setMode2Error("");
    setDraftCopied(false);
    setRegenCopied(false);
    setRegenMessage("");
    setMode2Phase("input");

    const count = lead.whatsappDraftCount ?? 0;

    if (count >= 1) {
      // Already generated once — open straight into mode 2
      setSavedDraft(lead.whatsappDraft || "");
      setMode(2);
      return;
    }

    // First time — generate AI draft, auto-save, then switch to mode 2
    setMode(1);
    setSavedDraft("");
    setMode1Loading(true);

    api
      .post("/v1/leads/whatsapp", {
        leadSummary: lead.leadSummary,
        techStack: lead.techStack ? Object.values(lead.techStack).flat().join(", ") : "N/A",
        timeline: lead.timeline,
        budget: lead.budget,
        originalLead: lead.leadSummary,
      })
      .then(async (res) => {
        const msg: string = res.data?.data?.message || "";
        setSavedDraft(msg);
        setMode1Loading(false);
        await dispatch(
          updateLead({ leadId: lead.id, payload: { whatsappDraft: msg, whatsappDraftCount: 1 } })
        );
        setMode(2);
      })
      .catch(() => {
        setMode1Loading(false);
        setMode1Error("Failed to generate the AI draft. Please close and try again.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const backdropClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  async function handleCopyDraft() {
    await navigator.clipboard.writeText(savedDraft);
    setDraftCopied(true);
    setTimeout(() => setDraftCopied(false), 2000);
  }

  async function handleCopyRegen() {
    await navigator.clipboard.writeText(regenMessage);
    setRegenCopied(true);
    setTimeout(() => setRegenCopied(false), 2000);
  }

  async function handleRegenerate() {
    setMode2Error("");
    setMode2Phase("generating");
    try {
      const res = await api.post("/v1/leads/whatsapp", {
        leadSummary: lead.leadSummary,
        techStack: lead.techStack ? Object.values(lead.techStack).flat().join(", ") : "N/A",
        timeline: lead.timeline,
        budget: lead.budget,
        originalLead: `Previous draft:\n${savedDraft}\n\nFollow-up notes:\n${followUp.trim() || "None"}`,
      });
      const msg: string = res.data?.data?.message || "";
      setRegenMessage(msg);
      await dispatch(
        updateLead({ leadId: lead.id, payload: { whatsappDraft: msg, whatsappDraftCount: 2 } })
      );
      setMode2Phase("result");
    } catch {
      setMode2Error("Failed to regenerate. Please try again.");
      setMode2Phase("input");
    }
  }

  const closeBtn = (
    <button
      onClick={onClose}
      className="p-1.5 rounded-lg text-ternary hover:bg-off-white hover:text-foreground transition-colors cursor-pointer shrink-0 mt-0.5"
    >
      <X size={18} />
    </button>
  );

  // ── MODE 1: generating + auto-saving ──────────────────────────────────────
  if (mode === 1) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={backdropClose}>
        <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl">
          <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Drafting WhatsApp Reply...</h2>
                <p className="text-xs text-ternary mt-0.5 truncate">{lead.fullProjectName}</p>
              </div>
            </div>
            {closeBtn}
          </div>

          <div className="p-10 flex flex-col items-center text-center gap-4">
            {mode1Error ? (
              <p className="text-sm text-error-text bg-error-bg border border-error-border rounded-xl px-4 py-3 w-full text-left">
                {mode1Error}
              </p>
            ) : (
              <>
                <Loader2 size={32} className="text-primary animate-spin" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {mode1Loading ? "Generating AI draft..." : "Draft ready — saving to lead..."}
                  </p>
                  <p className="text-xs text-ternary mt-1">
                    {mode1Loading
                      ? "AI is crafting a WhatsApp reply based on the lead details"
                      : "Saving the draft to this lead record"}
                  </p>
                </div>
              </>
            )}
          </div>

          {mode1Error && (
            <div className="p-5 border-t border-border flex justify-end">
              <Button label="Close" variant="secondary" className="px-5 py-2.5 text-sm" onClick={onClose} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MODE 2: sub-phase — generating (spinner) ───────────────────────────────
  if (mode2Phase === "generating") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={backdropClose}>
        <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl">
          <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Regenerating Reply...</h2>
                <p className="text-xs text-ternary mt-0.5 truncate">{lead.fullProjectName}</p>
              </div>
            </div>
            {closeBtn}
          </div>
          <div className="p-10 flex flex-col items-center text-center gap-4">
            <Loader2 size={32} className="text-primary animate-spin" />
            <div>
              <p className="text-sm font-semibold text-foreground">Regenerating with follow-up context...</p>
              <p className="text-xs text-ternary mt-1">Combining previous draft and your notes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MODE 2: sub-phase — result (regenerated message + copy) ───────────────
  if (mode2Phase === "result") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={backdropClose}>
        <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl">
          <div className="flex items-start justify-between gap-4 p-5 border-b border-border shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Regenerated Reply</h2>
                <p className="text-xs text-ternary mt-0.5 truncate">{lead.fullProjectName}</p>
              </div>
            </div>
            {closeBtn}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success-bg border border-success-border text-sm text-success-text">
              <Check size={14} className="shrink-0" />
              Regenerated and saved to this lead.
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Generated Message</p>
              <div className="px-4 py-4 rounded-xl bg-off-white border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {regenMessage}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-5 border-t border-border shrink-0">
            <Button
              label={regenCopied ? "Copied!" : "Copy to Clipboard"}
              icon={regenCopied ? <Check size={15} /> : <Copy size={15} />}
              iconPlacement="left"
              variant="primary"
              className="px-5 py-2.5 text-sm"
              onClick={handleCopyRegen}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── MODE 2: sub-phase — input (previous draft + follow-up + regenerate) ───
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={backdropClose}>
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">WhatsApp Follow-up</h2>
              <p className="text-xs text-ternary mt-0.5 truncate">{lead.fullProjectName}</p>
            </div>
          </div>
          {closeBtn}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Previous draft */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-foreground">Previous Draft</p>
              <button
                onClick={handleCopyDraft}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                {draftCopied ? <Check size={13} /> : <Copy size={13} />}
                {draftCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="px-4 py-4 rounded-xl bg-off-white border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {savedDraft || "No draft saved."}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Follow-up input */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1">
              Follow-up Notes
            </label>
            <p className="text-xs text-ternary mb-3">
              Add any extra context or notes. AI will combine this with the previous draft to regenerate a new message.
            </p>
            {mode2Error && (
              <p className="text-xs text-error-text mb-2">{mode2Error}</p>
            )}
            <textarea
              rows={6}
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="e.g. Client asked about mobile — emphasise our React Native experience and revised timeline..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border shrink-0">
          <Button label="Cancel" variant="secondary" className="px-5 py-2.5 text-sm" onClick={onClose} />
          <Button
            label="Regenerate"
            icon={<RefreshCw size={15} />}
            iconPlacement="left"
            variant="primary"
            className="px-5 py-2.5 text-sm"
            onClick={handleRegenerate}
          />
        </div>
      </div>
    </div>
  );
}
