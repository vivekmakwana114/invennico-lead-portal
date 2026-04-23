"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

const SOURCE_OPTIONS = ["Alliance", "Direct", "Referral", "Upwork", "Freelancer", "Other"].map(
  (s) => ({ label: s, value: s })
);

interface UploadedFile {
  name: string;
  size: number;
}

const LEAD_DETAILS_PLACEHOLDER = `Paste lead details here...

Example:
– We need a mobile app for iOS and Android
– User authentication and profiles
– Product catalog with search and filters
– Shopping cart and checkout
– Payment gateway integration (Stripe)
– Order tracking
– Admin dashboard for inventory management
– Expected timeline: 4–6 months
– Budget: $40,000 – $60,000`;

export default function CreateLeadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const [form, setForm] = useState({
    title: "",
    details: "",
    source: "Alliance",
    notes: "",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);

  function handleField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const allowed = Array.from(incoming).filter((f) =>
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type)
    );
    setFiles((prev) => [...prev, ...allowed.map((f) => ({ name: f.name, size: f.size }))]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function formatBytes(bytes: number) {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-ternary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link 
        href="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-ternary hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Leads
      </Link>

      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Submit New Lead</h2>
        <p className="text-sm text-ternary mt-1">
          Add lead details and let AI analyze requirements and generate insights
        </p>
      </div>

      {/* Project / Lead Title */}
      <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Project/Lead Title <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., E-commerce Mobile App for Fashion Retail"
          value={form.title}
          onChange={handleField("title")}
          className={inputClass}
        />
      </div>

      {/* Lead Details */}
      <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
        <div>
          <label className="text-sm font-semibold text-foreground">
            Lead Details <span className="text-primary">*</span>
          </label>
          <p className="text-xs text-ternary mt-0.5">
            Paste the full lead description, requirements, or RFP details. Include as much information as possible.
          </p>
        </div>
        <textarea
          rows={12}
          placeholder={LEAD_DETAILS_PLACEHOLDER}
          value={form.details}
          onChange={handleField("details")}
          className={`${inputClass} resize-none font-mono text-xs leading-relaxed`}
        />
      </div>

      {/* Attachments */}
      <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Attachments (RFP, PDF, DOC)
        </label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer p-8 flex flex-col items-center gap-2 ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-off-white"
          }`}
        >
          <Upload size={22} className="text-ternary" />
          <p className="text-sm text-center">
            <span className="text-primary font-medium cursor-pointer">Click to upload</span>
            <span className="text-ternary"> or drag and drop</span>
          </p>
          <p className="text-xs text-ternary">PDF, DOC, DOCX up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <ul className="space-y-2 mt-2">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-off-white border border-border text-sm">
                <span className="text-foreground truncate mr-4">{file.name}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-ternary text-xs">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="text-ternary hover:text-error-text transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lead Source + Internal Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <label className="text-sm font-semibold text-foreground">
            Lead Source <span className="text-primary">*</span>
          </label>
          <Dropdown
            options={SOURCE_OPTIONS}
            value={form.source}
            onChange={(v) => setForm((f) => ({ ...f, source: v }))}
          />
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
          <label className="text-sm font-semibold text-foreground">Internal Notes</label>
          <textarea
            rows={3}
            placeholder="Add any internal notes or context"
            value={form.notes}
            onChange={handleField("notes")}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Button
          label="Cancel"
          variant="secondary"
          className="px-6 py-2.5"
          onClick={() => router.push("/leads")}
        />
        <Button
          label="Submit & Analyze Lead"
          icon={<Sparkles size={16} />}
          iconPlacement="left"
          variant="primary"
          className="px-6 py-2.5"
          onClick={() => router.push("/leads/analyzing")}
        />
      </div>
    </div>
  );
}
