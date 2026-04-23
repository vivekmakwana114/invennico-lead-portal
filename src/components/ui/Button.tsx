"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  iconPlacement?: "left" | "right";
  variant?: "primary" | "secondary" | "blue" | "qualified" | "destructive";
}

/**
 * A reusable Button component with multiple variants.
 * The 'secondary' variant uses CSS :active and :focus states to transition 
 * to primary colors without maintaining React state.
 */
export function Button({
  label,
  icon,
  iconPlacement = "left",
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  
  const baseStyles = "flex items-center justify-center font-medium gap-2 rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none";
  
  const variantStyles = {
    primary: "bg-primary text-white shadow-primary/20 hover:shadow-primary/40",
    secondary: "bg-white text-ternary border border-border hover:bg-off-white active:bg-primary active:text-white focus:bg-primary focus:text-white transition-colors",
    blue: "bg-blue text-white hover:opacity-90 transition-opacity",
    qualified: "bg-success-bg text-success-text border border-success-border hover:bg-green-100/50",
    destructive: "bg-error-bg text-error-text border border-error-border hover:bg-red-100/50",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPlacement === "left" && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {icon && iconPlacement === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
