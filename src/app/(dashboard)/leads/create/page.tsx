"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { leadsService } from "@/state/leads/leadsService";

const SOURCE_OPTIONS = ["Alliance", "Direct", "Referral", "Upwork", "Freelancer", "Other"].map(
  (s) => ({ label: s, value: s })
);

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

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  uploading: boolean;
  error?: string;
  serverFileName?: string;
  pdfText?: string;
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

  async function uploadFile(fileEntry: UploadedFile) {
    try {
      const res = await leadsService.uploadPdf(fileEntry.file);
      const { fileName, extractedText } = res.data.data;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileEntry.id
            ? { ...f, uploading: false, serverFileName: fileName, pdfText: extractedText }
            : f
        )
      );
    } catch {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileEntry.id
            ? { ...f, uploading: false, error: "Upload failed. Please remove and re-add the file." }
            : f
        )
      );
    }
  }

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter((f) => f.type === "application/pdf");
    if (pdfs.length === 0) return;

    const newEntries: UploadedFile[] = pdfs.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      name: f.name,
      size: f.size,
      uploading: true,
    }));

    setFiles((prev) => [...prev, ...newEntries]);

    // Start upload immediately for each file
    newEntries.forEach((entry) => uploadFile(entry));
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  const isUploading = files.some((f) => f.uploading);
  const hasUploadError = files.some((f) => f.error);
  const canSubmit = form.title.trim() && form.details.trim() && !isUploading;

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-ternary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  function handleSubmit() {
    if (!canSubmit) return;

    const successfulFiles = files.filter((f) => f.serverFileName && !f.error);
    const pdfContent = successfulFiles
      .filter((f) => f.pdfText)
      .map((f) => f.pdfText as string)
      .join("\n\n---\n\n");

    sessionStorage.setItem(
      "pending_lead_data",
      JSON.stringify({
        title: form.title,
        details: form.details,
        source: form.source,
        notes: form.notes,
        attachments: successfulFiles.map((f) => f.serverFileName as string),
        pdfContent: pdfContent || null,
      })
    );
    router.push("/leads/analyzing");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-ternary hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Leads
      </Link>

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
        <div>
          <label className="text-sm font-semibold text-foreground">
            Attachments (PDF only)
          </label>
          <p className="text-xs text-ternary mt-0.5">
            PDFs are uploaded and their text is extracted for AI analysis.
          </p>
        </div>

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
          <p className="text-xs text-ternary">PDF up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          />
        </div>

        {files.length > 0 && (
          <ul className="space-y-2 mt-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-off-white border border-border text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {file.uploading ? (
                    <Loader2 size={15} className="text-primary animate-spin shrink-0" />
                  ) : file.error ? (
                    <AlertCircle size={15} className="text-error-text shrink-0" />
                  ) : (
                    <CheckCircle2 size={15} className="text-success-text shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-foreground truncate">{file.name}</p>
                    {file.uploading && (
                      <p className="text-xs text-ternary">Uploading and extracting text...</p>
                    )}
                    {file.error && (
                      <p className="text-xs text-error-text">{file.error}</p>
                    )}
                    {!file.uploading && !file.error && (
                      <p className="text-xs text-success-text">Text extracted — ready for AI</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-ternary text-xs">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                    className="text-ternary hover:text-error-text transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {isUploading && (
          <p className="text-xs text-ternary text-center">
            Waiting for uploads to complete before you can submit...
          </p>
        )}
        {hasUploadError && !isUploading && (
          <p className="text-xs text-error-text text-center">
            Some files failed to upload. Remove them or try again.
          </p>
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

      <div className="flex items-center justify-end gap-3 pb-8">
        <Button
          label="Cancel"
          variant="secondary"
          className="px-6 py-2.5"
          onClick={() => router.push("/leads")}
        />
        <Button
          label={isUploading ? "Uploading attachments..." : "Submit & Analyze Lead"}
          icon={isUploading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          iconPlacement="left"
          variant="primary"
          className="px-6 py-2.5"
          disabled={!canSubmit}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
