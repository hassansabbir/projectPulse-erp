"use client";

import { useStore } from "@/store/useStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
  const { projects, currentUser } = useStore();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <div className="p-4 bg-slate-100 rounded-full dark:bg-slate-800">
          <Activity className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold">Authorized Personnel Only</h2>
        <p className="text-slate-500 max-w-sm">
          Analytics are reserved for executive roles.
        </p>
      </div>
    );
  }

  // Mock Data Generators for robust visualization
  const earningsData = [
    { month: "Jan", revenue: 4000, cost: 2400 },
    { month: "Feb", revenue: 3000, cost: 1398 },
    { month: "Mar", revenue: 2000, cost: 9800 },
    { month: "Apr", revenue: 2780, cost: 3908 },
    { month: "May", revenue: 1890, cost: 4800 },
    { month: "Jun", revenue: 2390, cost: 3800 },
    { month: "Jul", revenue: 3490, cost: 4300 },
  ];

  const projectStatusData = [
    {
      name: "Active",
      value: projects.filter((p) => p.status === "Active").length + 5,
    }, // padding for demo
    {
      name: "Completed",
      value: projects.filter((p) => p.status === "Completed").length + 12,
    },
    {
      name: "Planning",
      value: projects.filter((p) => p.status === "Planning").length + 3,
    },
  ];

  const workloadData = [
    { name: "Week 1", tasks: 45, completed: 32 },
    { name: "Week 2", tasks: 52, completed: 40 },
    { name: "Week 3", tasks: 38, completed: 35 },
    { name: "Week 4", tasks: 65, completed: 20 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-6 space-y-6 w-full h-full bg-slate-50/50 dark:bg-slate-950">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Analytics Hub
        </h2>
        <p className="text-slate-500">Deep dive into organization metrics.</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
      >
        <motion.div variants={item} className="col-span-4 max-h-[400px]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue vs Cost</CardTitle>
              <CardDescription>First Half Performance 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={earningsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCost"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E2E8F0"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stroke="#f59e0b"
                      fillOpacity={1}
                      fill="url(#colorCost)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Project Status Ratio</CardTitle>
              <CardDescription>Distribution of project phases</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {projectStatusData.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-1 text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Task Velocity</CardTitle>
              <CardDescription>
                Assigned vs Completed Tasks over the last 4 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workloadData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{ fill: "#F1F5F9" }} />
                    <Bar dataKey="tasks" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="completed"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
