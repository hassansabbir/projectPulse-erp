"use client";

import { useStore } from "@/store/useStore";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";

export default function DashboardPage() {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  if (currentUser.role === "ADMIN") return <AdminDashboard />;
  if (currentUser.role === "MANAGER") return <ManagerDashboard />;
  return <MemberDashboard />;
}
