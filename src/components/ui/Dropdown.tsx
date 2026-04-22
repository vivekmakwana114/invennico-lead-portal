"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Dropdown({ options, value, onChange, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-off-white text-sm text-foreground hover:bg-white hover:border-primary/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span>{selected.label}</span>
        <ChevronDown
          size={14}
          className={cn("text-ternary shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul className="absolute z-[9999] top-full mt-1.5 w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer",
                  opt.value === value
                    ? "bg-primary/5 text-primary font-medium"
                    : "text-foreground hover:bg-off-white"
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
