"use client";

import React, { useState } from "react";
import { Trash2, Plus, Check, X, Pencil } from "lucide-react";
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
}

interface NewUser {
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Sales Manager", value: "sales-manager" },
  { label: "Team Member", value: "team-member" },
  { label: "Viewer", value: "viewer" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const initialMembers: TeamMember[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul@invennico.com", role: "admin", status: "active" },
  { id: "2", name: "Priya Patel", email: "priya@invennico.com", role: "team-member", status: "active" },
  { id: "3", name: "Amit Kumar", email: "amit@invennico.com", role: "team-member", status: "active" },
  { id: "4", name: "Neha Gupta", email: "neha@invennico.com", role: "viewer", status: "inactive" },
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

  function handleAddUser() {
    setNewUser({ name: "", email: "", role: "team-member", status: "active" });
  }

  function handleSaveNewUser() {
    if (!newUser) return;
    setMembers((prev) => [...prev, { id: Date.now().toString(), ...newUser }]);
    setNewUser(null);
  }

  function handleCancelNewUser() {
    setNewUser(null);
  }

  const colGrid = "grid-cols-[2fr_2fr_1.5fr_1fr_0.8fr]";

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
        <div className="min-w-[680px]">
          {/* Header */}
          <div className={cn("grid px-4 py-3 bg-gray-50 border-b border-border rounded-tl-xl rounded-tr-xl", colGrid)}>
            {["Name", "Email", "Role", "Status", "Actions"].map((col) => (
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
                  className="w-36"
                />

                {/* Status */}
                <Dropdown
                  options={statusOptions}
                  value={member.status}
                  onChange={(status) => handleStatusChange(member.id, status)}
                  className="w-28"
                />

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
                className="w-36"
              />
              <Dropdown
                options={statusOptions}
                value={newUser.status}
                onChange={(status) => setNewUser({ ...newUser, status: status as "active" | "inactive" })}
                className="w-28"
              />
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
