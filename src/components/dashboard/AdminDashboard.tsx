"use client";

import { useStore } from "@/store/useStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Award,
  ArrowUpRight,
  Clock,
  Briefcase,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#2563eb", "#6366f1", "#8b5cf6", "#ec4899"]; // Professional Blue/Indigo/Violet/Pink

export function AdminDashboard() {
  const { projects, members } = useStore();

  const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0);
  const activeProjects = projects.filter((p) => p.status === "Active");
  const delayedProjects = projects.filter(
    (p) => p.health === "Delayed" || p.health === "At Risk"
  );

  const healthStats = [
    {
      name: "Optimal",
      value: projects.filter((p) => p.health === "On Track").length,
    },
    {
      name: "Risk Identified",
      value: projects.filter((p) => p.health === "At Risk").length,
    },
    {
      name: "Critical Delay",
      value: projects.filter((p) => p.health === "Delayed").length,
    },
    {
      name: "Closed/Archived",
      value: projects.filter((p) => p.health === "Failed").length,
    },
  ];

  const managers = members.filter((m) => m.role === "MANAGER");
  const managerRankings = managers
    .map((m) => {
      const mProjects = projects.filter((p) => p.managerId === m.id);
      const total = mProjects.length;
      const budget = mProjects.reduce((sum, p) => sum + p.budget, 0);
      const riskCount = mProjects.filter(
        (p) => p.health === "At Risk" || p.health === "Delayed"
      ).length;
      const score = total > 0 ? 100 - riskCount * 15 : 0;

      return {
        id: m.id,
        name: m.name,
        avatar: m.avatar,
        projects: total,
        budget,
        score: Math.max(0, score),
      };
    })
    .sort((a, b) => b.score - a.score);

  const bestManager = managerRankings[0];

  return (
    <div className="p-8 space-y-10 w-full min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans">
      {/* KPI Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Active Revenue",
            value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
          {
            label: "Operational Projects",
            value: activeProjects.length,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
          },
          {
            label: "Critical Items",
            value: delayedProjects.length,
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-50 dark:bg-rose-900/20",
          },
          {
            label: "Global Performance",
            value: "92.4%",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="border-none shadow-xs bg-white dark:bg-slate-900 flex items-center p-6 gap-5"
          >
            <div className={cn("p-3 rounded-lg", kpi.bg)}>
              <kpi.icon className={cn("w-6 h-6", kpi.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {kpi.label}
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                {kpi.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-xs bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  Revenue Projections
                </CardTitle>
                <CardDescription className="text-xs">
                  Fiscal year assessment vs actual billing.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-bold border-slate-200 dark:border-slate-800 uppercase tracking-tighter bg-slate-50 dark:bg-slate-950"
              >
                Current Q4
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-8">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { n: "Jan", r: 4000 },
                    { n: "Feb", r: 3500 },
                    { n: "Mar", r: 5200 },
                    { n: "Apr", r: 4800 },
                    { n: "May", r: 6100 },
                    { n: "Jun", r: 5900 },
                    { n: "Jul", r: 7200 },
                  ]}
                >
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="n"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "6px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="r"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#areaColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xs bg-white dark:bg-slate-900">
          <CardHeader className="px-8 pt-8 text-center">
            <CardTitle className="text-lg font-bold">
              Portfolio Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Health stratification of active assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <div className="h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {healthStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.[0]) {
                        return (
                          <div className="bg-slate-950 text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-xl border border-slate-800">
                            {payload[0].name}: {payload[0].value} Projects
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {projects.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Assets
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6 px-4">
              {healthStats.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span className="text-[10px] font-bold text-slate-500 truncate">
                    {s.name.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-none shadow-xs bg-white dark:bg-slate-900">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">
                Leadership Leaderboard
              </CardTitle>
              <CardDescription className="text-xs">
                Top performing account managers.
              </CardDescription>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-4 shadow-none">
            {managerRankings.slice(0, 4).map((m, i) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[#fafbfc] dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 group hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-bold text-slate-300 w-4">0{i + 1}</span>
                  <Avatar className="h-9 w-9 border border-white dark:border-slate-800 shadow-sm">
                    <AvatarImage src={m.avatar} />
                    <AvatarFallback className="font-bold">
                      {m.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {m.projects} Client Engagements
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-tighter">
                      Budget Managed
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      ${(m.budget / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                      {m.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xs bg-white dark:bg-slate-900">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-lg font-bold">
              Resource Allocation
            </CardTitle>
            <CardDescription className="text-xs">
              Capacity utilization across active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            {[
              { label: "Engineering Fleet", val: 84, color: "bg-blue-600" },
              { label: "Design Operations", val: 62, color: "bg-indigo-600" },
              { label: "Capital Expenditure", val: 45, color: "bg-violet-600" },
              { label: "Client Support", val: 91, color: "bg-emerald-600" },
            ].map((r, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">{r.label}</span>
                  <span className="text-slate-900 dark:text-white">
                    {r.val}% Utilization
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      r.color
                    )}
                    style={{ width: `${r.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
