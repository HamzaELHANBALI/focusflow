"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/tasks" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo size="sm" showText={true} />
          </Link>
          
          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
            <a
              href="https://www.tiktok.com/@hmzcodes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <span className="hidden sm:inline">Follow on</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span className="font-medium">@hmzcodes</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

