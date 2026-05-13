"use client";

import { useState, useRef, useEffect } from "react";

const segments = [
  { value: "", label: "Selecione seu segmento" },
  { value: "alimentacao", label: "Alimentação" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "moda", label: "Moda" },
  { value: "beleza", label: "Beleza" },
  { value: "servicos", label: "Serviços profissionais" },
  { value: "varejo", label: "Varejo" },
  { value: "imobiliario", label: "Imobiliário" },
  { value: "infoproduto", label: "Infoproduto / Expert" },
  { value: "agencia", label: "Agência" },
  { value: "outro", label: "Outro" },
];

interface SharkSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SharkSelect({ value, onChange }: SharkSelectProps) {
  const [open, setOpen] = useState(false);
  const [upwards, setUpwards] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = segments.find((s) => s.value === value);
  const hasValue = value !== "";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;
      setUpwards(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
    setOpen(!open);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full flex items-center justify-between gap-2 p-3.5 text-sm rounded-xl border
          bg-[#000000]/30 backdrop-blur-sm transition-all duration-300
          ${hasValue ? "text-[#F4F7FB]" : "text-[#BFC4CC]/40"}
          ${open || hasValue ? "border-[#25A7F0]/60" : "border-[#173B74]/40"}
          ${open ? "shadow-[0_0_16px_rgba(37,167,240,0.12)]" : ""}
          ${open && upwards ? "rounded-b-xl" : ""}
          ${open && !upwards ? "rounded-t-xl" : ""}
        `}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0 text-[#25A7F0]/60">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="truncate">{selected ? selected.label : "Selecione seu segmento"}</span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`w-4 h-4 flex-shrink-0 text-[#BFC4CC]/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          className={`absolute z-50 w-full border border-[#25A7F0]/20 bg-[#0A1018]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden
            ${upwards ? "bottom-full mb-1 rounded-t-xl" : "top-full mt-1 rounded-b-xl"}
          `}
          style={{ animation: "selectSlideIn 0.15s ease-out" }}
        >
          {segments.map((seg) => (
            <button
              key={seg.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(seg.value); setOpen(false); }}
              className={`
                w-full text-left px-3.5 py-3 text-sm flex items-center gap-2.5 transition-all duration-150
                ${seg.value === value ? "bg-[#1E63C6]/20 text-[#F4F7FB]" : "text-[#BFC4CC]/70 hover:bg-[#1E63C6]/10 hover:text-[#F4F7FB]"}
              `}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200 ${seg.value === value ? "bg-[#25A7F0] shadow-[0_0_6px_rgba(37,167,240,0.5)]" : "bg-transparent"}`} />
              {seg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
