"use client";

import React, { useState } from "react";
import { Trash2, Plus, Check, X, Pencil, Minus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { Dropdown } from "@/components/ui/Dropdown";
import { getInitials } from "@/lib/utils";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  totalCredits: number;
  consumedCredits: number;
}

interface NewUser {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  totalCredits: number;
  consumedCredits: number;
}

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Partner", value: "partner" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const initialMembers: TeamMember[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul@invennico.com", role: "admin", status: "active", totalCredits: 100, consumedCredits: 42 },
  { id: "2", name: "Priya Patel", email: "priya@invennico.com", role: "partner", status: "active", totalCredits: 50, consumedCredits: 12 },
  { id: "3", name: "Amit Kumar", email: "amit@invennico.com", role: "partner", status: "active", totalCredits: 50, consumedCredits: 5 },
  { id: "4", name: "Neha Gupta", email: "neha@invennico.com", role: "partner", status: "inactive", totalCredits: 0, consumedCredits: 0 },
];


export function UserManagementTab() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [newUser, setNewUser] = useState<NewUser | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; email: string }>({ name: "", email: "" });

  function handleRoleChange(id: string, role: string) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  function handleStatusChange(id: string, status: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: status as "active" | "inactive" } : m))
    );
  }

  function handleEdit(member: TeamMember) {
    setEditingId(member.id);
    setEditData({ name: member.name, email: member.email });
  }

  function handleSaveEdit() {
    if (!editingId) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === editingId ? { ...m, ...editData } : m))
    );
    setEditingId(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
  }

  function handleDelete(id: string) {
    const member = members.find((m) => m.id === id);
    if (member?.status === "active") {
      toast.warning("Please mark the user as inactive before deleting.");
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleIncrementCredits(id: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, totalCredits: m.totalCredits + 1 } : m))
    );
  }

  function handleDecrementCredits(id: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, totalCredits: Math.max(m.consumedCredits, m.totalCredits - 1) }
          : m
      )
    );
  }

  function handleAddUser() {
    setNewUser({ name: "", email: "", role: "partner", status: "active", totalCredits: 50, consumedCredits: 0 });
  }

  function handleSaveNewUser() {
    if (!newUser) return;
    setMembers((prev) => [...prev, { id: Date.now().toString(), ...newUser }]);
    setNewUser(null);
  }

  function handleCancelNewUser() {
    setNewUser(null);
  }

  const colGrid = "grid-cols-[1.8fr_2fr_1.2fr_1fr_1.1fr_1.4fr_0.7fr]";

  return (
    <div className="space-y-6">
      {/* Team Members */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Team Members</h2>
            <p className="text-sm text-ternary mt-1">
              Manage team members and their access permissions
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <Plus size={15} />
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className={cn("grid gap-3 px-4 py-3 bg-gray-50 border-b border-border rounded-tl-xl rounded-tr-xl", colGrid)}>
            {["Name", "Email", "Role", "Status", "Used Credits", "Total Credits", "Actions"].map((col) => (
              <span key={col} className="text-xs font-semibold text-ternary uppercase tracking-wide">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {members.map((member, index) => {
            const isEditing = editingId === member.id;
            return (
              <div
                key={member.id}
                className={cn(
                  "grid gap-3 px-4 py-3 items-center bg-white",
                  colGrid,
                  (index < members.length - 1 || newUser) && "border-b border-border",
                  isEditing && "bg-primary/5"
                )}
              >
                {/* Name */}
                {isEditing ? (
                  <input
                    autoFocus
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {getInitials(member.name)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{member.name}</span>
                  </div>
                )}

                {/* Email */}
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <span className="text-sm text-ternary">{member.email}</span>
                )}

                {/* Role */}
                <Dropdown
                  options={roleOptions}
                  value={member.role}
                  onChange={(role) => handleRoleChange(member.id, role)}
                  className="w-full"
                />

                {/* Status */}
                <Dropdown
                  options={statusOptions}
                  value={member.status}
                  onChange={(status) => handleStatusChange(member.id, status)}
                  className="w-full"
                />

                {/* Credits Used */}
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-ternary px-1">
                    {member.consumedCredits} used
                  </span>
                </div>

                {/* Allocated Credits */}
                <div className="flex items-center">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDecrementCredits(member.id)}
                      className="w-6 h-6 flex items-center justify-center border border-border text-ternary hover:text-foreground hover:bg-gray-50 rounded transition-colors cursor-pointer"
                      title="Decrease credits by 1"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-bold text-foreground min-w-[2rem] text-center">
                      {member.totalCredits}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrementCredits(member.id)}
                      className="w-6 h-6 flex items-center justify-center border border-border text-ternary hover:text-foreground hover:bg-gray-50 rounded transition-colors cursor-pointer"
                      title="Increase credits by 1"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-700 transition-colors cursor-pointer"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(member)}
                      className="text-ternary hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id)}
                      className="text-primary hover:text-primary/70 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* New user editable row */}
          {newUser && (
            <div className={cn("grid gap-3 px-4 py-3 items-center bg-primary/5", colGrid)}>
              <input
                autoFocus
                type="text"
                placeholder="Full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Dropdown
                options={roleOptions}
                value={newUser.role}
                onChange={(role) => setNewUser({ ...newUser, role })}
                className="w-full"
              />
              <Dropdown
                options={statusOptions}
                value={newUser.status}
                onChange={(status) => setNewUser({ ...newUser, status: status as "active" | "inactive" })}
                className="w-full"
              />
              {/* Credits Used */}
              <div className="flex items-center">
                <span className="text-sm font-semibold text-ternary px-1">
                  0 used
                </span>
              </div>

              {/* Allocated Credits */}
              <div className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNewUser(prev => prev ? { ...prev, totalCredits: Math.max(0, prev.totalCredits - 1) } : null)}
                    className="w-6 h-6 flex items-center justify-center border border-border text-ternary hover:text-foreground hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    title="Decrease default credits by 1"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-sm font-bold text-foreground min-w-[2rem] text-center">
                    {newUser.totalCredits}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNewUser(prev => prev ? { ...prev, totalCredits: prev.totalCredits + 1 } : null)}
                    className="w-6 h-6 flex items-center justify-center border border-border text-ternary hover:text-foreground hover:bg-gray-50 rounded transition-colors cursor-pointer"
                    title="Increase default credits by 1"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveNewUser}
                  className="text-green-600 hover:text-green-700 transition-colors cursor-pointer"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleCancelNewUser}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

    </div>
  );
}
