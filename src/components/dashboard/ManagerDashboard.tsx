"use client";

import { useStore } from "@/store/useStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import {
  Users,
  Clock,
  AlertCircle,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ManagerDashboard() {
  const { currentUser, projects, tasks } = useStore();

  if (!currentUser) return null;

  // Filter proper data
  const myProjects = projects.filter((p) => p.managerId === currentUser.id);
  const myProjectIds = myProjects.map((p) => p.id);
  const teamTasks = tasks.filter((t) => myProjectIds.includes(t.projectId));

  const activeProjects = myProjects.filter((p) => p.status === "Active");
  const upcomingDeadlines = teamTasks.filter((t) => {
    const diff = differenceInDays(new Date(t.deadline), new Date());
    return diff >= 0 && diff <= 7 && t.status !== "Done";
  });

  const delayedTasks = teamTasks.filter((t) => {
    return new Date(t.deadline) < new Date() && t.status !== "Done";
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6 w-full h-full bg-slate-50/50 dark:bg-slate-950"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Manager Overview
        </h2>
        <p className="text-slate-500">
          Track your projects and team performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <Briefcase className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Tasks</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamTasks.length}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card
            className={
              delayedTasks.length > 0 ? "border-red-500 border-l-4" : ""
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Delayed Tasks
              </CardTitle>
              <AlertCircle
                className={`h-4 w-4 ${
                  delayedTasks.length > 0 ? "text-red-500" : "text-slate-500"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{delayedTasks.length}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Deadlines
              </CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingDeadlines.length}
              </div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Projects List */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item} className="space-y-6">
          <h3 className="text-xl font-semibold">My Projects</h3>
          {myProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      project.health === "On Track" ? "default" : "destructive"
                    }
                    className={
                      project.health === "On Track" ? "bg-emerald-500" : ""
                    }
                  >
                    {project.health}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Timeline</span>
                    <span className="font-medium">
                      {format(new Date(project.startDate), "MMM d")} -{" "}
                      {format(new Date(project.endDate), "MMM d")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Budget Utilization</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <h3 className="text-xl font-semibold">Critical Attention Needed</h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {delayedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-200">
                        {task.title}
                      </p>
                      <p className="text-xs text-red-500 font-medium">
                        Due {format(new Date(task.deadline), "MMM d")}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-red-200 text-red-600 bg-red-50"
                    >
                      Late
                    </Badge>
                  </div>
                ))}
                {delayedTasks.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <p>No delayed tasks! Great job.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
