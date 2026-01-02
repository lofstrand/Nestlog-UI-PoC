
import React from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// --- ICON RENDERER ---
export const DynamicIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 18, className = "" }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  children, 
  className = '', 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
    danger: "bg-[#fdf3f0] text-[#b45c43] border border-[#f9dad3] hover:bg-[#f9dad3]",
    white: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-8 py-3.5 text-base rounded-2xl gap-3"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
};

// --- CONTAINERS ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${noPadding ? '' : 'p-8'} ${className}`}>
    {children}
  </div>
);

// --- HEADERS ---
export const PageHeader: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
    <div className="space-y-1">
      <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{title}</h1>
      {description && <p className="text-slate-500 font-medium text-lg leading-tight">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const SectionHeading: React.FC<{ icon?: LucideIcon; label: string; color?: string }> = ({ icon: Icon, label, color = "text-slate-400" }) => (
  <div className="flex items-center space-x-2 mb-4">
    {Icon && <Icon size={14} className={color} />}
    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>{label}</h3>
  </div>
);

// --- DATA ---
export const Badge: React.FC<{ children: React.ReactNode; color?: string; bgColor?: string; borderColor?: string; className?: string }> = ({ 
  children, 
  color = "text-slate-500", 
  bgColor = "bg-slate-50", 
  borderColor = "border-slate-200",
  className = ""
}) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${color} ${bgColor} ${borderColor} ${className}`}>
    {children}
  </span>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; icon?: LucideIcon; textarea?: boolean }> = ({ label, icon: Icon, textarea, ...props }) => {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">{Icon && <Icon size={10} className="mr-1.5" />}{label}</label>}
      <Component 
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner placeholder:text-slate-300"
        {...(props as any)}
      />
    </div>
  );
};
