"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface GridComponentProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
  rowKey?: (row: T) => string | number;
}

export function GridComponent<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  emptyMessage = "No data available.",
  rowKey,
}: GridComponentProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-border bg-white", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ternary whitespace-nowrap",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-ternary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowKey ? rowKey(row) : rowIndex}
                className="border-b border-border last:border-0 hover:bg-off-white transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-4 text-foreground align-top", col.className)}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
