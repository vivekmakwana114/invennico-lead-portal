"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, User, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { logout } from "@/state/auth/authSlice";
import { getInitials } from "@/lib/utils";
import { BASE_URL } from "@/lib/api";
import { leadsService } from "@/state/leads/leadsService";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  create: "Create New Lead",
  analyzing: "Analyzing Lead",
  settings: "Settings",
  profile: "My Profile",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const profileAvatar = useAppSelector((state) => state.users.profile?.avatar);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await leadsService.getLeads({ search: q.trim(), limit: 5 });
      const results = res.data?.data?.results || [];
      setSearchResults(results);
      setShowDropdown(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(searchQuery), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, runSearch]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectResult(lead: any) {
    setSearchQuery("");
    setShowDropdown(false);
    setSearchResults([]);
    router.push(`/leads/${lead.leadId}`);
  }

  // ── Page title ────────────────────────────────────────────────────────────
  const pathSegments = pathname?.split("/").filter(Boolean) ?? [];

  const getPageTitle = () => {
    if (pathSegments.length === 0) return "Dashboard";
    if (pathSegments[0] === "leads" && pathSegments.length === 2) return "Lead Detail";
    const last = pathSegments[pathSegments.length - 1];
    return PAGE_TITLES[last] ?? last.charAt(0).toUpperCase() + last.slice(1);
  };

  const [avatarError, setAvatarError] = useState(false);
  const displayName  = user?.name ?? "";
  const displayEmail = user?.email ?? "";
  const initials     = getInitials(displayName);

  const rawAvatar = profileAvatar || user?.avatar;
  const avatarSrc = rawAvatar
    ? rawAvatar.startsWith("http://") || rawAvatar.startsWith("https://")
      ? rawAvatar
      : `${BASE_URL}${rawAvatar}`
    : null;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setAvatarError(false); }, [avatarSrc]);

  function handleLogout()     { setMenuOpen(false); dispatch(logout()); router.push("/login"); }
  function handleViewProfile(){ setMenuOpen(false); router.push("/profile"); }

  const STATUS_LABEL: Record<string, string> = {
    new: "New", qualified: "Qualified", "engagement-started": "Engaged",
    "proposal-sent": "Proposal Sent", won: "Won", drop: "Dropped",
  };
  const STATUS_COLOR: Record<string, string> = {
    qualified: "text-success-text", won: "text-success-text",
    drop: "text-error-text", "proposal-sent": "text-blue",
  };

  return (
    <header className="h-16 border-b border-border bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="lg:hidden p-2 rounded-lg text-ternary hover:bg-off-white hover:text-foreground transition-colors cursor-pointer shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-foreground leading-tight truncate">{getPageTitle()}</h1>
      </div>

      {/* Right: search + avatar */}
      <div className="flex items-center gap-4 shrink-0">

        {/* Search */}
        <div ref={searchRef} className="relative group hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ternary group-focus-within:text-primary transition-colors pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
            placeholder="Search leads..."
            className="pl-10 pr-4 py-2 bg-off-white border border-border rounded-xl text-sm w-56 lg:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              {searchLoading ? (
                <div className="px-4 py-3 text-sm text-ternary">Searching…</div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-ternary">No leads found</div>
              ) : (
                <ul>
                  {searchResults.map((lead: any) => (
                    <li key={lead.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectResult(lead)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-off-white transition-colors text-left cursor-pointer border-b border-border last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lead.title}</p>
                          <p className="text-xs text-ternary mt-0.5">
                            {lead.leadId ?? `LD-${lead.leadNumber}`} · {lead.source}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold mt-0.5 shrink-0 ${STATUS_COLOR[lead.status] || "text-ternary"}`}>
                          {STATUS_LABEL[lead.status] || lead.status}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Avatar + dropdown */}
        <div ref={menuRef} className="relative flex items-center gap-3 sm:pl-4 sm:border-l sm:border-border">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-10 h-10 rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all overflow-hidden"
          >
            {avatarSrc && !avatarError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
            ) : (
              initials
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-50">
              <div className="px-3 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-ternary">{displayEmail}</p>
              </div>
              <div className="py-1">
                <button type="button" onClick={handleViewProfile} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-off-white transition-colors cursor-pointer">
                  <User size={15} className="text-ternary" />View Profile
                </button>
                <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                  <LogOut size={15} />Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
