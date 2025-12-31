"use client";

import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  BarChart,
  LogOut,
  UserCircle,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function Sidebar() {
  const { currentUser, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "MANAGER", "MEMBER"],
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: Layers,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      title: "My Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
      roles: ["MANAGER", "MEMBER"],
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: Briefcase,
      roles: ["ADMIN"],
    },
    {
      title: "Team Members",
      href: "/dashboard/team",
      icon: Users,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
      roles: ["ADMIN"],
    },
  ];

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 min-h-screen hidden md:flex flex-col fixed left-0 top-0 z-50 shadow-2xl shadow-blue-900/5">
      <div className="flex flex-col h-full py-6">
        <div className="px-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white text-xs font-black">P</span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
              ProjectPulse
              <span className="text-[10px] bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-900 ml-1">
                PRO
              </span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                  isActive
                    ? "bg-slate-900 border border-slate-800 text-blue-400 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                {item.title}
                {isActive && (
                  <div className="ml-auto w-1 h-3.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-auto pt-6 border-t border-slate-900/50">
          <div className="mb-4">
            <div className="flex items-center gap-3 p-2.5 rounded-md bg-slate-900/40 border border-slate-900/60 transition-colors hover:bg-slate-900/60">
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 relative">
                {currentUser.avatar ? (
                  <Image
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                ) : (
                  <UserCircle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-200 truncate leading-none mb-1">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-widest leading-none">
                  {currentUser.role}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-all group uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
