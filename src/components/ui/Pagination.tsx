"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  maxPageButtons?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "items",
  maxPageButtons = 5,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = start + maxPageButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPageButtons + 1);
    }
    const pages: (number | "...")[] = [];
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
      <p className="text-sm text-ternary">
        Showing <span className="font-medium text-foreground">{from}</span> to{" "}
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-border text-ternary hover:bg-off-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-ternary select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "w-8 h-8 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                currentPage === page
                  ? "bg-primary text-white shadow-sm"
                  : "border border-border text-ternary hover:bg-off-white"
              )}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-border text-ternary hover:bg-off-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
