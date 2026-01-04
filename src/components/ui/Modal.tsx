import React, { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

export type ModalProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  size?: ModalSize;
  onClose: () => void;
  onPrimaryAction?: () => void;
  primaryActionType?: "button" | "submit";
  formId?: string;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  subtitle,
  icon: Icon,
  size = "lg",
  onClose,
  onPrimaryAction,
  primaryActionType = "button",
  formId,
  primaryActionLabel,
  primaryActionDisabled,
  footer,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const isSubmitCombo =
        (e.ctrlKey || e.metaKey) && (e.key === "Enter" || e.key === "NumpadEnter");
      if (isSubmitCombo && primaryActionType === "submit" && formId && !primaryActionDisabled) {
        e.preventDefault();
        const form = document.getElementById(formId) as HTMLFormElement | null;
        form?.requestSubmit?.();
        return;
      }
      if (isSubmitCombo && onPrimaryAction && !primaryActionDisabled) {
        e.preventDefault();
        onPrimaryAction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formId, isOpen, onClose, onPrimaryAction, primaryActionDisabled, primaryActionType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative bg-white w-full ${SIZE_CLASS[size]} rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]`}
      >
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            {Icon && (
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0">
                <Icon size={22} />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">{children}</div>

        {(footer || primaryActionLabel) && (
          <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 shrink-0">
            {footer}
            {primaryActionLabel && (
              <button
                type={primaryActionType}
                form={primaryActionType === "submit" ? formId : undefined}
                onClick={onPrimaryAction}
                disabled={primaryActionDisabled}
                className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {primaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
