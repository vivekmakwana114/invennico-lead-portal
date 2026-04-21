"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
  
  // Basic breadcrumb logic
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  
  const getPageTitle = () => {
    if (pathSegments.length === 0) return "Dashboard";
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <header className="h-16 border-b border-border bg-white px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-foreground leading-tight">{getPageTitle()}</h1>
        {/* <div className="flex items-center gap-1">
          <Link href="/dashboard" className="text-[10px] font-medium text-ternary hover:text-primary transition-colors">
            Invennico
          </Link>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={segment}>
              <ChevronRight size={10} className="text-border" />
              <span className="text-[10px] font-medium text-ternary capitalize">
                {segment}
              </span>
            </React.Fragment>
          ))}
        </div> */}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ternary group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search leads, tasks..." 
            className="pl-10 pr-4 py-2 bg-off-white border border-border rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
