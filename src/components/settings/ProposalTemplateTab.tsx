"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, FileText, AlertCircle, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchSettings } from "@/state/settings/settingsSlice";
import { settingsService } from "@/state/settings/settingsService";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ProposalTemplateTab() {
  const dispatch = useAppDispatch();
  const { settings, isLoading } = useAppSelector((s: any) => s.settings);

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  async function handleFileSelected(file: File) {
    if (!file.name.endsWith(".docx")) {
      setUploadError("Only .docx files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be under 10 MB.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      await settingsService.uploadProposalTemplate(file);
      dispatch(fetchSettings());
      toast.success("Template uploaded successfully.", { duration: 3000 });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Upload failed.";
      setUploadError(msg);
      toast.error(msg, { duration: 3000 });
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }

  function handleDownload() {
    settingsService.downloadProposalTemplate();
  }

  const hasCustomTemplate = !!settings?.proposalTemplatePath;

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-ternary">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Proposal Template
        </h2>
        <p className="text-sm text-ternary mt-1">
          Upload a branded Word (.docx) template. The AI fills in content at
          generation time. Falls back to the built-in template if none is
          uploaded.
        </p>
      </div>

      {/* Error banner */}
      {uploadError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-bg border border-error-border text-error-text text-sm font-medium">
          <AlertCircle size={16} />
          {uploadError}
        </div>
      )}

      {/* Current template status */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-xl">
        <FileText size={18} className="text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {hasCustomTemplate ? "Custom template active" : "Using default template"}
          </p>
          <p className="text-xs text-ternary truncate mt-0.5">
            {hasCustomTemplate
              ? settings.proposalTemplatePath.split(/[\\/]/).pop()
              : "proposal-template.docx (built-in)"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap cursor-pointer"
        >
          <Download size={14} />
          {hasCustomTemplate ? "Download current" : "Download default"}
        </button>
      </div>

      {/* Upload area */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          Upload new template
        </p>
        <div
          className={cn(
            "border-2 border-dashed rounded-xl px-6 py-10 flex flex-col items-center gap-3 transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-gray-50 hover:border-primary/50"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <Upload size={28} className="text-ternary" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drag &amp; drop a .docx file here
            </p>
            <p className="text-xs text-ternary mt-0.5">or click to browse</p>
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? "Uploading…" : "Choose File"}
          </button>
          <p className="text-xs text-ternary">.docx only · max 10 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            className="sr-only"
            onChange={onInputChange}
          />
        </div>
      </div>

      {/* Tip */}
      <div className="border border-orange-200 bg-orange-50 rounded-xl px-4 py-3 text-sm text-gray-700">
        <span className="mr-1">💡</span>
        <span>
          <span className="font-semibold">Tip:</span> Download the default
          template, open it in Microsoft Word, customise the design (logo,
          colours, fonts, tables), then upload it back here.
        </span>
      </div>
    </div>
  );
}
