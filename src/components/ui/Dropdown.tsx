"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
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
  disabled?: boolean;
}

export function Dropdown({ options, value, onChange, className, disabled = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function handleClose(e: MouseEvent) {
      // Close if click is outside both the button and the portal menu
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        const menu = document.getElementById("dropdown-portal-menu");
        if (!menu || !menu.contains(e.target as Node)) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // Recalculate position on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    function reposition() {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        });
      }
    }
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  function handleToggle() {
    if (disabled) return;
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setOpen((v) => !v);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border bg-off-white text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-white hover:border-primary/40 cursor-pointer"
        )}
      >
        <span>{selected.label}</span>
        <ChevronDown
          size={14}
          className={cn("text-ternary shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <ul
            id="dropdown-portal-menu"
            style={menuStyle}
            className="rounded-xl border border-border bg-white shadow-lg overflow-hidden"
          >
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
          </ul>,
          document.body
        )}
    </div>
  );
}
