"use client";

import { Target } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg`}>
          <Target className={`${size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-6 w-6"} text-white`} />
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent`}>
          FocusFlow
        </span>
      )}
    </div>
  );
}

