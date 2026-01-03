import React from "react";
import type { LucideIcon } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "white";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
    danger: "bg-[#fdf3f0] text-[#b45c43] border border-[#f9dad3] hover:bg-[#f9dad3]",
    white: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-8 py-3.5 text-base rounded-2xl gap-3",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 18} />}
      {children}
    </button>
  );
};

