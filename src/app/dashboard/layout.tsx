"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Loader2,
  ChevronRight,
  Home,
  Bell,
  Search as SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (!mounted || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Simple breadcrumb logic
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans antialiased text-slate-900 border-none">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Navigation / Breadcrumbs */}
        <header className="h-14 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Home className="w-3.5 h-3.5" />
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
            {pathSegments.map((segment, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className={cn(
                    "capitalize font-semibold tracking-tight",
                    idx === pathSegments.length - 1
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500"
                  )}
                >
                  {segment.replace(/-/g, " ")}
                </span>
                {idx < pathSegments.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200/50 dark:border-slate-800 text-slate-400">
              <SearchIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">
                Search project assets...
              </span>
              <kbd className="ml-2 text-[9px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-sans font-medium uppercase">
                ⌘K
              </kbd>
            </div>
            <button className="relative p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full border border-white dark:border-slate-900 shadow-sm"></span>
            </button>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
