"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Calendar, MapPin, User, Sparkles, Monitor, Server,
  Plug, Cloud, Clock, MessageCircle, Info, CheckCircle2, RefreshCw,
  Download, MessageSquare, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getLeadDetail } from "@/components/leads/LeadsDetailData";

// ── Score Colour ──────────────────────────────────────────────────────────────

function scoreLabelColor(score: number) {
  if (score >= 80) return "text-success-text";
  if (score >= 60) return "text-yellow";
  return "text-error-text";
}

// ── Section Card ──────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-border rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-foreground mb-4">
      {icon}
      {children}
    </h2>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LeadViewPage() {
  const { id } = useParams<{ id: string }>();
  const lead = getLeadDetail(decodeURIComponent(id));

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-foreground font-medium">Lead not found</p>
        <Link href="/leads" className="text-sm text-primary hover:underline">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  const { aiQualification: ai, techStack, milestones, suggestedQuestions, auditLog, zoho } = lead;

  return (
    <div className="space-y-6 pb-12">
      {/* Back */}
      <Link
        href="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-ternary hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Leads
      </Link>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">

        {/* ── Left: main content ─────────────────────────────────────────── */}
        <div className="space-y-5 min-w-0">

          {/* Header */}
          <Card>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{lead.fullProjectName}</h1>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ternary">
                  <span className="font-mono font-medium">{lead.id}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} />{lead.dateReceived}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} />{lead.source}</span>
                  <span className="flex items-center gap-1.5"><User size={13} />{lead.clientContact}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Lead Summary */}
          <Card>
            <SectionTitle icon={<FileText size={20} className="text-primary" />}>
              Lead Summary
            </SectionTitle>
            <p className="text-sm text-ternary leading-relaxed">{lead.leadSummary}</p>
          </Card>

          {/* AI Qualification Analysis */}
          <Card>
            <SectionTitle icon={<Sparkles size={20} className="text-primary" />}>
              AI Qualification Analysis (Pre-Sales)
            </SectionTitle>

            {/* Score bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Qualification Score</span>
                <span className="text-sm font-bold text-primary">{ai.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-blue"
                  style={{ width: `${ai.score}%` }}
                />
              </div>
            </div>

            {/* Label + description */}
            <p className={`text-sm font-semibold mb-2 ${scoreLabelColor(ai.score)}`}>
              {ai.label}
            </p>
            <p className="text-sm text-ternary leading-relaxed mb-4">{ai.description}</p>

            {/* Next action */}
            <div className="border-l-4 border-primary bg-orange-50 rounded-r-xl px-4 py-3 mb-3">
              <p className="text-xs font-semibold text-primary mb-1">Recommended Next Action (Pre-Sales)</p>
              <p className="text-sm text-ternary leading-relaxed">{ai.nextAction}</p>
            </div>

            {/* Handoff note */}
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <Info size={14} className="text-blue mt-0.5 shrink-0" />
              <p className="text-sm text-ternary leading-relaxed">{ai.handoffNote}</p>
            </div>
          </Card>

          {/* Recommended Tech Stack */}
          <Card>
            <SectionTitle icon={<span className="text-primary text-lg leading-none">◆</span>}>
              Recommended Tech Stack
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {techStack.frontend && (
                <TechCategory
                  icon={<Monitor size={18} className="text-blue" />}
                  label="Frontend"
                  items={techStack.frontend}
                  dotColor="bg-blue"
                />
              )}
              {techStack.backend && (
                <TechCategory
                  icon={<Server size={18} className="text-purple" />}
                  label="Backend"
                  items={techStack.backend}
                  dotColor="bg-purple"
                />
              )}
              {techStack.integrations && (
                <TechCategory
                  icon={<Plug size={18} className="text-primary" />}
                  label="Integrations"
                  items={techStack.integrations}
                  dotColor="bg-primary"
                />
              )}
              {techStack.hosting && (
                <TechCategory
                  icon={<Cloud size={18} className="text-teal-500" />}
                  label="Hosting"
                  items={techStack.hosting}
                  dotColor="bg-teal-500"
                />
              )}
            </div>
          </Card>

          {/* Estimated Timeline & Budget */}
          <Card>
            <SectionTitle icon={<Clock size={18} className="text-primary" />}>
              Estimated Timeline &amp; Budget
            </SectionTitle>

            {/* Summary row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-ternary mb-1">Estimated Duration</p>
                <p className="text-2xl font-bold text-foreground">{lead.timeline}</p>
              </div>
              <div>
                <p className="text-sm text-ternary mb-1">Budget Range</p>
                <p className="text-2xl font-bold text-primary">{lead.budget}</p>
              </div>
            </div>

            {/* Milestone table */}
            {milestones.length > 0 && (
              <>
                <p className="text-sm font-semibold text-foreground mb-3">Milestone Breakdown</p>
                <div className="space-y-0 border border-border rounded-xl overflow-hidden">
                  {milestones.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 text-sm border-b border-border last:border-0 hover:bg-off-white transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{m.name}</p>
                        <p className="text-sm text-ternary mt-0.5">{m.duration}</p>
                      </div>
                      <span className="font-semibold text-foreground whitespace-nowrap">{m.cost}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Suggested Questions */}
          <Card>
            <SectionTitle icon={<MessageCircle size={18} className="text-primary" />}>
              Suggested Questions to Ask
            </SectionTitle>
            <ol className="space-y-4">
              {suggestedQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ternary">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-off-white border border-border text-xs font-semibold text-ternary flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </Card>

          {/* Audit Log */}
          <Card>
            <SectionTitle icon={<Clock size={18} className="text-ternary" />}>
              Audit Log
            </SectionTitle>
            <div className="space-y-0">
              {auditLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{entry.label}</p>
                    <p className="text-xs text-ternary mt-0.5">
                      {entry.date} &nbsp;·&nbsp; {entry.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Right: sidebar ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Zoho CRM Sync */}
          {zoho && (
            <Card className="p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Zoho CRM Sync</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-bg border border-success-border mb-3">
                <CheckCircle2 size={14} className="text-success-text shrink-0" />
                <span className="text-xs font-semibold text-success-text">{zoho.status}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ternary">CRM ID:</span>
                  <span className="font-medium text-foreground">{zoho.crmId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ternary">Last Synced:</span>
                  <span className="font-medium text-foreground">{zoho.lastSynced}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">Actions</p>

            <Button
              label="Draft WhatsApp Reply"
              icon={<MessageSquare size={15} />}
              iconPlacement="left"
              variant="primary"
              className="w-full px-4 py-2.5 text-sm"
            />

            <Button
              label="Prepare Proposal"
              icon={<FileText size={15} />}
              iconPlacement="left"
              variant="blue"
              className="w-full px-4 py-2.5 text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                label="Sync to Zoho"
                icon={<RefreshCw size={13} />}
                iconPlacement="left"
                variant="secondary"
                className="w-full px-3 py-2 text-sm"
              />
              <Button
                label="Export PDF"
                icon={<Download size={13} />}
                iconPlacement="left"
                variant="secondary"
                className="w-full px-3 py-2 text-sm"
              />
            </div>

            {/* Pre-sales note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-ternary leading-relaxed">
              <span className="font-semibold text-blue">Pre-Sales Actions: </span>
              Qualify leads and prepare proposals. Sales team handles Won/Lost in Zoho CRM.
            </div>

            <Button
              label="Mark as Qualified (Handoff to Sales)"
              variant="qualified"
              className="w-full px-4 py-2.5 text-sm"
            />
            <Button
              label="Mark as Rejected"
              variant="destructive"
              className="w-full px-4 py-2.5 text-sm"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Tech Category Sub-component ───────────────────────────────────────────────

function TechCategory({
  icon,
  label,
  items,
  dotColor,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  dotColor: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">
        {icon}
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ternary">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
