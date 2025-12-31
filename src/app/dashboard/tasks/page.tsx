"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const { tasks, members, projects, addTask, updateTask, currentUser } =
    useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    priority: "Medium",
    status: "To Do",
    orderDate: format(new Date(), "yyyy-MM-dd"),
    deadline: format(new Date(), "yyyy-MM-dd"),
  });

  const filteredTasks = tasks.filter((t) => {
    if (currentUser?.role === "MEMBER" && t.assignedTo !== currentUser.id)
      return false;
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!newTask.title || !newTask.projectId) return;
    const task: Task = {
      ...(newTask as Task),
      id: Math.random().toString(36).substring(2, 11),
    };
    addTask(task);
    setIsDialogOpen(false);
    setNewTask({
      title: "",
      priority: "Medium",
      status: "To Do",
      orderDate: format(new Date(), "yyyy-MM-dd"),
      deadline: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const statusIcons = {
    "To Do": <Circle className="w-3.5 h-3.5 text-slate-300" />,
    "In Progress": <Clock className="w-3.5 h-3.5 text-blue-500" />,
    Review: <AlertCircle className="w-3.5 h-3.5 text-amber-500" />,
    Done: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 font-sans">
      {/* Task Toolbar */}
      <div className="p-6 pb-0 flex items-center justify-between border-b border-transparent">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search tasks by title..."
              className="pl-9 h-9 w-[300px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs shadow-xs focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as TaskStatus | "ALL")}
            >
              <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 shadow-none text-xs font-semibold text-slate-600 bg-transparent">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Tasks</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {currentUser?.role !== "MEMBER" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 font-bold px-4 h-9 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  New Delivery Item
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Description
                  </Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="e.g. Prototype User Flow"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Contextual Project
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      setNewTask({ ...newTask, projectId: v })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Assign to project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Owner
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setNewTask({ ...newTask, assignedTo: v })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Assign member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Urgency
                    </Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(v) =>
                        setNewTask({
                          ...newTask,
                          priority: v as "Low" | "Medium" | "High",
                        })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Maturity Date
                  </Label>
                  <Input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="h-10"
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  className="h-11 bg-blue-600 font-bold mt-2"
                >
                  Provision Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* High-Density Task List */}
      <div className="p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 w-12 text-center">
                    #
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Delivery Identifier
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Project Context
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Ownership
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map((task, idx) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const assignee = members.find(
                    (m) =>
                      m.name === task.assignedTo || m.id === task.assignedTo
                  );

                  return (
                    <tr
                      key={task.id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-xs font-bold text-slate-300 tabular-nums text-center">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "text-sm font-semibold tracking-tight transition-colors",
                            task.status === "Done"
                              ? "text-slate-400 line-through"
                              : "text-slate-900 dark:text-white"
                          )}
                        >
                          {task.title}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                          {project?.title || "System"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={task.status}
                            onValueChange={(val) =>
                              updateTask(task.id, { status: val as TaskStatus })
                            }
                          >
                            <SelectTrigger className="h-7 border-0 p-0 focus:ring-0 shadow-none text-xs font-bold text-slate-600 bg-transparent gap-1.5">
                              {statusIcons[task.status]}
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(statusIcons).map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-black px-1.5 py-0 border-transparent rounded h-5 uppercase tracking-tighter",
                            task.priority === "High"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                              : task.priority === "Medium"
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                          )}
                        >
                          {task.priority} Priority
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <AvatarImage src={assignee?.avatar} />
                            <AvatarFallback className="text-[10px] font-bold">
                              {assignee?.name?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-slate-500">
                            {assignee?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-400 tabular-nums tracking-tighter uppercase">
                          <Clock className="w-3 h-3" />
                          {format(new Date(task.deadline), "MMM d, yyyy")}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
