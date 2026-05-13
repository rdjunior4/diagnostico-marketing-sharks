"use client";

import React, { useRef, useEffect, useState, ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface StarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  lightWidth?: number;
  duration?: number;
  glowColor?: string;
  lightColor?: string;
  className?: string;
}

export function StarButton({
  children,
  lightWidth = 120,
  duration = 3,
  glowColor = "#25A7F0",
  lightColor,
  className,
  disabled,
  ...props
}: StarButtonProps) {
  const color = lightColor || glowColor;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (buttonRef.current) {
      const btn = buttonRef.current;
      btn.style.setProperty(
        "--path",
        `path('M ${btn.offsetWidth * 0.1} 0 H ${btn.offsetWidth * 0.9} V ${btn.offsetHeight} H ${btn.offsetWidth * 0.1} V 0')`,
      );
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          "--duration": `${duration}s`,
          "--light-width": `${lightWidth}px`,
          "--glow-color": color,
          "--glow-alpha": "0.15",
          isolation: "isolate",
        } as CSSProperties
      }
      className={cn(
        "relative z-[3] overflow-hidden px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-500 disabled:pointer-events-none disabled:opacity-40 group/star-button select-none",
        "bg-gradient-to-br from-[#173B74] via-[#1a4a8a] to-[#1E63C6] border border-[#25A7F0]/20 shadow-[0_0_20px_rgba(37,167,240,0.08)]",
        !disabled && "hover:shadow-[0_0_30px_rgba(37,167,240,0.25)] hover:scale-[1.02] hover:border-[#25A7F0]/50",
        className,
      )}
      {...props}
    >
      {/* Brilho suave por trás */}
      <div
        className="absolute inset-0 opacity-0 group-hover/star-button:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(37,167,240,0.12) 0%, transparent 60%),
                       radial-gradient(ellipse at 50% 100%, rgba(30,99,198,0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Partícula animada */}
      <div
        className="absolute aspect-square rounded-full blur-xl opacity-0 group-hover/star-button:opacity-100 transition-opacity duration-700"
        style={{
          width: "var(--light-width)",
          offsetPath: "var(--path)",
          offsetDistance: "0%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animation: `star-btn var(--duration) ease-in-out infinite`,
        }}
      />

      {/* Borda superior brilhante */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover/star-button:opacity-100 transition-opacity duration-500"
        style={{
background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
           boxShadow: `0 0 8px ${color}40, 0 0 16px ${color}20`,
        }}
      />

      {/* Borda inferior brilhante */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover/star-button:opacity-100 transition-opacity duration-500 delay-100"
        style={{
background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
           boxShadow: `0 0 8px ${color}20`,
        }}
      />

      {/* Pulse suave contínuo */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-0 group-hover/star-button:opacity-100 transition-opacity duration-700"
        style={{
          boxShadow: `inset 0 0 30px ${color}08, inset 0 1px 0 ${color}15`,
          animation: `pulse-glow-soft 3s ease-in-out infinite`,
        }}
      />

      {/* Texto com gradiente */}
      <span className="z-10 relative bg-gradient-to-t from-white to-[#BFC4CC] inline-block text-transparent bg-clip-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
        {children}
      </span>

      {/* Efeito ripple no clique */}
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
        <div className="ripple-effect absolute inset-0 opacity-0 group-active/star-button:opacity-100 transition-opacity duration-300" />
      </div>
    </button>
  );
}

// Injetar keyframes via estilo inline no componente
if (typeof document !== "undefined") {
  const styleId = "star-button-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes star-btn {
        0% {
          offset-distance: 0%;
          opacity: 0;
          transform: scale(0.5);
        }
        15% {
          opacity: 0.8;
          transform: scale(1);
        }
        85% {
          opacity: 0.8;
          transform: scale(1);
        }
        100% {
          offset-distance: 100%;
          opacity: 0;
          transform: scale(0.5);
        }
      }
      @keyframes pulse-glow-soft {
        0%, 100% {
          opacity: 0.4;
        }
        50% {
          opacity: 0.8;
        }
      }
      .ripple-effect {
        background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), rgba(255,255,255,0.15) 0%, transparent 60%);
        animation: ripple-expand 0.6s ease-out;
      }
      @keyframes ripple-expand {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}