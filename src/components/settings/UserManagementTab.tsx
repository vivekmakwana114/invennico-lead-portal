"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Trash2, Plus, Check, X, Pencil, Upload } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { Dropdown } from "@/components/ui/Dropdown";
import { getInitials } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/state/hooks";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  grantUserCredits,
  adminUploadUserLogo,
  adminRemoveUserLogo,
} from "@/state/users/usersSlice";
import { BASE_URL } from "@/lib/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NewUser {
  name: string;
  email: string;
  role: "admin" | "partner";
}

interface EditData {
  name: string;
  email: string;
}

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Partner", value: "partner" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

// Name | Email | Role | Status | Credits Used | Assign Credits | Logo | Actions
const colGrid = "grid-cols-[180px_220px_130px_120px_120px_200px_90px_80px] gap-x-4";

export function UserManagementTab() {
  const dispatch = useAppDispatch();
  const { usersList, isLoading, actionLoading } = useAppSelector((state) => state.users);

  const [newUser, setNewUser]     = useState<NewUser | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData]   = useState<EditData>({ name: "", email: "" });

  // Assign credits stepper state
  const [assigningId, setAssigningId]       = useState<string | null>(null);
  const [creditAmount, setCreditAmount]     = useState(1);
  const [isTypingCredit, setIsTypingCredit] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ── Row actions ──────────────────────────────────────────────────────────────

  async function handleRoleChange(id: string, role: string) {
    const result = await dispatch(updateUser({ userId: id, payload: { role: role as "admin" | "partner" } }));
    if (updateUser.rejected.match(result)) {
      toast.error((result.payload as string) || "Failed to update role.");
    }
  }

  async function handleStatusChange(id: string, status: string) {
    const result = await dispatch(updateUser({ userId: id, payload: { status: status as "active" | "inactive" } }));
    if (updateUser.rejected.match(result)) {
      toast.error((result.payload as string) || "Failed to update status.");
    }
  }

  function handleEdit(member: any) {
    setEditingId(member.id);
    setEditData({ name: member.name, email: member.email });
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    const result = await dispatch(updateUser({ userId: editingId, payload: editData }));
    if (updateUser.fulfilled.match(result)) {
      setEditingId(null);
    } else {
      toast.error((result.payload as string) || "Failed to update user.");
    }
  }

  async function handleDelete(member: any) {
    if (member.status === "active") {
      toast.warning("Mark the user as inactive before deleting.");
      return;
    }
    const result = await dispatch(deleteUser(member.id));
    if (deleteUser.fulfilled.match(result)) {
      toast.success("User deleted successfully.");
    } else {
      toast.error((result.payload as string) || "Failed to delete user.");
    }
  }

  // ── New user ─────────────────────────────────────────────────────────────────

  async function handleSaveNewUser() {
    if (!newUser?.name.trim() || !newUser?.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    const result = await dispatch(createUser({ name: newUser.name, email: newUser.email, role: newUser.role }));
    if (createUser.fulfilled.match(result)) {
      toast.success("User created. Default password: NewUser@707K10");
      setNewUser(null);
    } else {
      toast.error((result.payload as string) || "Failed to create user.");
    }
  }

  // ── Logo management ──────────────────────────────────────────────────────────

  async function handleAdminLogoUpload(userId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const result = await dispatch(adminUploadUserLogo({ userId, file }));
    if (adminUploadUserLogo.rejected.match(result)) {
      toast.error((result.payload as string) || "Failed to upload logo.");
    } else {
      toast.success("Logo uploaded.");
    }
  }

  async function handleAdminLogoRemove(userId: string) {
    const result = await dispatch(adminRemoveUserLogo(userId));
    if (adminRemoveUserLogo.rejected.match(result)) {
      toast.error((result.payload as string) || "Failed to remove logo.");
    } else {
      toast.success("Logo removed.");
    }
  }

  // ── Assign credits stepper ───────────────────────────────────────────────────

  function openAssign(id: string) {
    setAssigningId(id);
    setCreditAmount(1);
    setIsTypingCredit(false);
  }

  function closeAssign() {
    setAssigningId(null);
    setCreditAmount(1);
    setIsTypingCredit(false);
  }

  function increment() { setCreditAmount((v) => v + 1); }
  function decrement() { setCreditAmount((v) => Math.max(1, v - 1)); }

  async function confirmAssign(userId: string) {
    if (creditAmount < 1) {
      toast.error("Amount must be at least 1.");
      return;
    }
    const result = await dispatch(grantUserCredits({ userId, amount: creditAmount }));
    if (grantUserCredits.fulfilled.match(result)) {
      toast.success(`${creditAmount} credit(s) assigned successfully.`);
      closeAssign();
    } else {
      toast.error((result.payload as string) || "Failed to assign credits.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Team Members</h2>
            <p className="text-sm text-ternary mt-1">Manage team members, roles, and credit allocation</p>
          </div>
          <button
            type="button"
            onClick={() => setNewUser({ name: "", email: "", role: "partner" })}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Plus size={15} />
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <div className="min-w-[1160px]">

            {/* Table header */}
            <div className={cn("grid px-4 py-3 bg-gray-50 border-b border-border rounded-tl-xl rounded-tr-xl", colGrid)}>
              {["Name", "Email", "Role", "Status", "Credits Used", "Assign Credits", "Logo", "Actions"].map((col) => (
                <span key={col} className="text-xs font-semibold text-ternary uppercase tracking-wide">
                  {col}
                </span>
              ))}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-12 text-sm text-ternary">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                Loading users...
              </div>
            )}

            {/* Empty */}
            {!isLoading && usersList.length === 0 && !newUser && (
              <div className="flex items-center justify-center py-12 text-sm text-ternary">
                No users found.
              </div>
            )}

            {/* Data rows */}
            {!isLoading && usersList.map((member, index) => {
              const isEditing   = editingId === member.id;
              const isAssigning = assigningId === member.id;

              return (
                <div
                  key={member.id}
                  className={cn(
                    "grid px-4 py-3 items-center bg-white",
                    colGrid,
                    (index < usersList.length - 1 || newUser) && "border-b border-border",
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
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {getInitials(member.name)}
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">{member.name}</span>
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
                    <span className="text-sm text-ternary whitespace-nowrap">{member.email}</span>
                  )}

                  {/* Role */}
                  <Dropdown
                    options={roleOptions}
                    value={member.role}
                    onChange={(role) => handleRoleChange(member.id, role)}
                  />

                  {/* Status */}
                  <Dropdown
                    options={statusOptions}
                    value={member.status}
                    onChange={(status) => handleStatusChange(member.id, status)}
                  />

                  {/* Credits Used — pill */}
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-foreground whitespace-nowrap">
                      {member.consumedCredits ?? 0} / {member.totalCredits ?? 0}
                    </span>
                  </div>

                  {/* Assign Credits — stepper */}
                  {isAssigning ? (
                    <div className="flex items-center gap-1">
                      {/* Decrement */}
                      <button
                        type="button"
                        onClick={decrement}
                        className="w-6 h-6 flex items-center justify-center rounded border border-border bg-white hover:bg-off-white text-foreground text-sm font-semibold leading-none transition-colors cursor-pointer shrink-0"
                      >
                        −
                      </button>

                      {/* Amount — click to type */}
                      {isTypingCredit ? (
                        <input
                          autoFocus
                          type="number"
                          min={1}
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          onBlur={() => setIsTypingCredit(false)}
                          className="w-10 text-center px-1 py-0.5 text-sm font-semibold border border-primary rounded focus:outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsTypingCredit(true)}
                          title="Click to type amount"
                          className="w-10 text-center text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-text"
                        >
                          {creditAmount}
                        </button>
                      )}

                      {/* Increment */}
                      <button
                        type="button"
                        onClick={increment}
                        className="w-6 h-6 flex items-center justify-center rounded border border-border bg-white hover:bg-off-white text-foreground text-sm font-semibold leading-none transition-colors cursor-pointer shrink-0"
                      >
                        +
                      </button>

                      {/* Confirm */}
                      <button
                        type="button"
                        onClick={() => confirmAssign(member.id)}
                        disabled={actionLoading}
                        className="ml-1 text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                      >
                        <Check size={14} />
                      </button>

                      {/* Cancel */}
                      <button
                        type="button"
                        onClick={closeAssign}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAssign(member.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-colors cursor-pointer w-fit"
                    >
                      <Plus size={12} />
                      Assign
                    </button>
                  )}

                  {/* Logo */}
                  {(() => {
                    const logoPath = member.logoPath;
                    const logoUrl = logoPath
                      ? logoPath.startsWith("http") ? logoPath : `${BASE_URL}${logoPath}`
                      : null;
                    return (
                      <div className="flex items-center gap-1.5">
                        {logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={logoUrl}
                            alt="logo"
                            className="h-6 max-w-[48px] object-contain rounded border border-border bg-gray-50"
                          />
                        ) : null}
                        <label className="text-ternary hover:text-primary transition-colors cursor-pointer shrink-0" title="Upload logo">
                          <Upload size={14} />
                          <input
                            type="file"
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => handleAdminLogoUpload(member.id, e)}
                          />
                        </label>
                        {logoUrl && (
                          <button
                            type="button"
                            title="Remove logo"
                            onClick={() => handleAdminLogoRemove(member.id)}
                            disabled={actionLoading}
                            className="text-ternary hover:text-red-500 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={actionLoading}
                        className="text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
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
                        onClick={() => handleDelete(member)}
                        disabled={actionLoading}
                        className="text-primary hover:text-primary/70 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* New user row */}
            {newUser && (
              <div className={cn("grid px-4 py-3 items-center bg-primary/5", colGrid)}>
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
                  onChange={(role) => setNewUser({ ...newUser, role: role as "admin" | "partner" })}
                />
                <span className="text-sm text-ternary px-1">Active</span>
                <span className="text-sm text-ternary">—</span>
                <span className="text-sm text-ternary">—</span>
                <span className="text-sm text-ternary">—</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveNewUser}
                    disabled={actionLoading}
                    className="text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUser(null)}
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
