"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  BarChart2,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MemberDashboard() {
  const { currentUser, tasks, projects, updateTask } = useStore();

  if (!currentUser) return null;

  const myTasks = tasks.filter((t) => t.assignedTo === currentUser.id);

  const completedTasks = myTasks.filter((t) => t.status === "Done");
  const pendingTasks = myTasks.filter((t) => t.status !== "Done");
  const overdueTasks = pendingTasks.filter(
    (t) => isPast(new Date(t.deadline)) && !isToday(new Date(t.deadline))
  );

  // Tasks due today
  const dueToday = pendingTasks.filter((t) => isToday(new Date(t.deadline)));

  const handleCompleteTask = (id: string) => {
    updateTask(id, {
      status: "Done",
      deliveryDate: format(new Date(), "yyyy-MM-dd"),
    });
  };

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
      animate="visible"
      className="p-6 space-y-6 w-full h-full bg-slate-50/50 dark:bg-slate-950"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome, {currentUser.name}
        </h2>
        <p className="text-slate-500">Here is your daily briefing.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Pending completion
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Today</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueToday.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueTasks.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">Total finished</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={item} className="col-span-2 space-y-6">
          <h3 className="text-xl font-semibold">Priority Tasks</h3>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingTasks
                  .sort(
                    (a, b) =>
                      new Date(a.deadline).getTime() -
                      new Date(b.deadline).getTime()
                  )
                  .map((task) => {
                    const project = projects.find(
                      (p) => p.id === task.projectId
                    );
                    const isOverdue =
                      isPast(new Date(task.deadline)) &&
                      !isToday(new Date(task.deadline));

                    return (
                      <div
                        key={task.id}
                        className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="mt-1 h-8 w-8 rounded-full border-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-500"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <div className="h-4 w-4" />
                          </Button>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-200">
                              {task.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {project?.title || "Unknown Project"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={
                              isOverdue
                                ? "border-red-200 text-red-600 bg-red-50"
                                : "border-slate-200"
                            }
                          >
                            {isOverdue
                              ? "Overdue"
                              : format(new Date(task.deadline), "MMM d")}
                          </Badge>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                            {task.priority}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {pendingTasks.length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-50" />
                    <p className="text-lg font-medium">All caught up!</p>
                    <p>No pending tasks assigned to you.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-8">
            {completedTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 ring-4 ring-white dark:border-slate-950 dark:ring-slate-950" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                    Completed &quot;{task.title}&quot;
                  </p>
                  <p className="text-xs text-slate-500">
                    {task.deliveryDate
                      ? format(new Date(task.deliveryDate), "MMM d, h:mm a")
                      : "Recently"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
