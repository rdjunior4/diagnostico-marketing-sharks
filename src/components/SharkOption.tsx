"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface SharkCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  icon?: string;
  score?: number;
  delay?: number;
}

export function SharkCheckbox({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  icon,
  score,
  delay = 0,
}: SharkCheckboxProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const handleClick = () => {
    if (disabled) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    onChange(!checked);
  };

  return (
    <motion.button
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
      disabled={disabled}
      tabIndex={0}
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.05, duration: 0.45 }}
      whileHover={{ scale: checked ? 1.02 : 1.01 }}
      whileTap={{ scale: checked ? 0.99 : 0.98 }}
      className={`
        relative w-full flex items-center gap-3 p-4 rounded-xl border cursor-pointer
        transition-all duration-300 ease-out
        ${checked
          ? "border-[#25A7F0] bg-[#1E63C6]/15 shadow-[0_0_20px_rgba(37,167,240,0.15)]"
          : disabled
          ? "border-[#173B74]/10 bg-[#000000]/10 text-[#BFC4CC]/30 cursor-not-allowed"
          : "border-[#173B74]/25 bg-[#0A1018]/30 text-[#F4F7FB]/80 hover:border-[#25A7F0]/40 hover:bg-[#1E63C6]/5 hover:shadow-[0_0_15px_rgba(37,167,240,0.08)]"
        }
        group/shark-option select-none
      `}
    >
      <motion.span
        className={`absolute inset-0 rounded-xl transition-opacity duration-400 pointer-events-none ${isAnimating ? "opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(37,167,240,0.15),transparent_70%)]" : "opacity-0"}`}
        animate={{ scale: isAnimating ? [1, 1.3] : 1, opacity: isAnimating ? [0, 0.5, 0] : 0 }}
        transition={{ duration: 0.4 }}
      />
      {!disabled && <span className="absolute inset-0 rounded-xl opacity-0 group-hover/shark-option:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(37,167,240,0.04),transparent_70%)]" />}
      <span className={`relative flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ease-out ${checked ? "border-[#25A7F0] bg-gradient-to-br from-[#25A7F0] to-[#173B74] shadow-[0_0_12px_rgba(37,167,240,0.3)]" : disabled ? "border-[#173B74]/20 bg-transparent" : "border-[#25A7F0]/40 bg-transparent group-hover/shark-option:border-[#25A7F0]/60 group-hover/shark-option:shadow-[0_0_8px_rgba(37,167,240,0.1)]"}`}>
        <motion.span
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="4 12 10 18 20 6" /></svg>
        </motion.span>
        {checked && icon && (
          <motion.span className="absolute -top-1.5 -right-1.5 text-[10px]" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>{icon}</motion.span>
        )}
      </span>
      <span className="relative z-10 flex-1 text-left min-w-0">
        <span className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${checked ? "text-[#F4F7FB]" : disabled ? "text-[#BFC4CC]/30" : "text-[#F4F7FB]/80"}`}>{label}</span>
      </span>
      <input type="checkbox" id={id} checked={checked} onChange={handleClick} disabled={disabled} className="sr-only" tabIndex={-1} readOnly />
    </motion.button>
  );
}

interface SharkRadioProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: string;
  score?: number;
  description?: string;
  delay?: number;
}

export function SharkRadio({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  icon,
  score,
  description,
  delay = 0,
}: SharkRadioProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const handleClick = () => {
    if (disabled) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    onChange(value);
  };

  return (
    <motion.button
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
      disabled={disabled}
      tabIndex={0}
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.05, duration: 0.45 }}
      whileHover={{ scale: checked ? 1.02 : 1.01 }}
      whileTap={{ scale: checked ? 0.99 : 0.98 }}
      className={`
        relative w-full flex items-start gap-3 p-4 rounded-xl border cursor-pointer
        transition-all duration-300 ease-out
        ${checked
          ? "border-[#25A7F0] bg-[#1E63C6]/15 shadow-[0_0_20px_rgba(37,167,240,0.15)]"
          : disabled
          ? "border-[#173B74]/10 bg-[#000000]/10 text-[#BFC4CC]/30 cursor-not-allowed"
          : "border-[#173B74]/25 bg-[#0A1018]/30 text-[#F4F7FB]/80 hover:border-[#25A7F0]/40 hover:bg-[#1E63C6]/5 hover:shadow-[0_0_15px_rgba(37,167,240,0.08)]"
        }
        group/shark-option select-none
      `}
    >
      <motion.span
        className={`absolute inset-0 rounded-xl transition-opacity duration-400 pointer-events-none ${isAnimating ? "opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(37,167,240,0.15),transparent_70%)]" : "opacity-0"}`}
        animate={{ scale: isAnimating ? [1, 1.3] : 1, opacity: isAnimating ? [0, 0.5, 0] : 0 }}
        transition={{ duration: 0.4 }}
      />
      {!disabled && <span className="absolute inset-0 rounded-xl opacity-0 group-hover/shark-option:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(37,167,240,0.04),transparent_70%)]" />}
      <span className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ease-out ${checked ? "border-[#25A7F0] bg-gradient-to-br from-[#25A7F0] to-[#173B74] shadow-[0_0_12px_rgba(37,167,240,0.3)]" : disabled ? "border-[#173B74]/20 bg-transparent" : "border-[#25A7F0]/40 bg-transparent group-hover/shark-option:border-[#25A7F0]/60 group-hover/shark-option:shadow-[0_0_8px_rgba(37,167,240,0.1)]"}`}>
        <motion.span className="w-2.5 h-2.5 rounded-full bg-white" animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }} transition={{ duration: 0.2 }} />
        {checked && icon && <motion.span className="absolute -top-1.5 -right-1.5 text-[10px]" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>{icon}</motion.span>}
      </span>
      <span className="relative z-10 flex-1 text-left min-w-0">
        <span className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${checked ? "text-[#F4F7FB]" : disabled ? "text-[#BFC4CC]/30" : "text-[#F4F7FB]/80"}`}>{label}</span>
        {description && <span className={`text-[11px] block mt-1 transition-colors duration-300 ${checked ? "text-[#BFC4CC]/60" : "text-[#BFC4CC]/30"}`}>{description}</span>}
      </span>
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={() => {}} disabled={disabled} className="sr-only" tabIndex={-1} readOnly />
    </motion.button>
  );
}