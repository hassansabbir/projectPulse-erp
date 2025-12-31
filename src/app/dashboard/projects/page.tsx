"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  DollarSign,
  Users,
  Briefcase,
  ChevronRight,
  Activity,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { projects, clients, members, tasks, addProject, currentUser } =
    useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    budget: 0,
    status: "Planning",
    health: "On Track",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clients
        .find((c) => c.id === p.clientId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!newProject.title || !newProject.clientId) return;
    const project: Project = {
      ...(newProject as Project),
      id: Math.random().toString(36).substring(2, 11),
    };
    addProject(project);
    setIsDialogOpen(false);
    setNewProject({
      title: "",
      budget: 0,
      status: "Planning",
      health: "On Track",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950">
      {/* Page Action Bar */}
      <div className="p-6 pb-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search projects by name or client..."
              className="pl-9 h-9 w-[320px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-blue-500 shadow-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-900/50 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            {projects.length} Total Projects
          </div>
        </div>

        {currentUser.role === "ADMIN" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  New Project
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Initiate a new project in the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Project Title
                  </Label>
                  <Input
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    placeholder="Enter project name..."
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Client Partner
                  </Label>
                  <Select
                    onValueChange={(v) =>
                      setNewProject({ ...newProject, clientId: v })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select business partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Budget (USD)
                    </Label>
                    <Input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          budget: Number(e.target.value),
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Project Lead
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setNewProject({ ...newProject, managerId: v })
                      }
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Assign manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {members
                          .filter((m) => m.role === "MANAGER")
                          .map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Provision Date
                    </Label>
                    <Input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          startDate: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Delivery Date
                    </Label>
                    <Input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          endDate: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreate}
                  className="h-11 bg-blue-600 font-bold"
                >
                  Deploy Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Enterprise Table Section */}
      <div className="p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[30%] text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3 pl-6">
                  Project Context
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">
                  Stakeholder
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">
                  Lead
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">
                  Timeline
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3 text-right">
                  Budget Items
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3 text-center">
                  Lifecycle
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3 text-right pr-6">
                  Health
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => {
                const client = clients.find((c) => c.id === project.clientId);
                const manager = members.find((m) => m.id === project.managerId);
                return (
                  <TableRow
                    key={project.id}
                    onClick={() => openProjectDetails(project)}
                    className="group border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </span>
                        <span className="text-xs text-slate-400 line-clamp-1">
                          {project.description ||
                            "System standard project deployment."}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                          {client?.name.substring(0, 2).toUpperCase() || "NA"}
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {client?.name || "Unidentified"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {manager ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700 shadow-xs">
                            <AvatarImage src={manager.avatar} />
                            <AvatarFallback className="text-[10px]">
                              {manager.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {manager.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 italic">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5 w-32">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                          <span>Delivery</span>
                          <span>
                            {format(new Date(project.endDate), "MMM d")}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span className="text-sm font-bold tabular-nums text-slate-700 dark:text-slate-200">
                        ${project.budget.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold px-2 py-0 border-transparent rounded h-5",
                            project.status === "Active"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              : project.status === "Completed"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          )}
                        >
                          {project.status.toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <div className="flex justify-end">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            project.health === "On Track"
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                              : project.health === "At Risk"
                              ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                              : "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                          )}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Professional Project Details Modal (Linear/SaaS Style) */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[1000px] p-0 gap-0 h-[85vh] flex flex-col overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl">
          {selectedProject &&
            (() => {
              const client = clients.find(
                (c) => c.id === selectedProject.clientId
              );
              const manager = members.find(
                (m) => m.id === selectedProject.managerId
              );
              const projectTasks = tasks.filter(
                (t) => t.projectId === selectedProject.id
              );
              const completedTasks = projectTasks.filter(
                (t) => t.status === "Done"
              ).length;
              const progress =
                projectTasks.length > 0
                  ? Math.round((completedTasks / projectTasks.length) * 100)
                  : 0;
              const daysRemaining = Math.max(
                0,
                Math.ceil(
                  (new Date(selectedProject.endDate).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              );

              return (
                <>
                  <div className="h-14 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50/30 dark:bg-slate-900/30 shrink-0">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="h-6 text-[10px] font-bold border-slate-200 dark:border-slate-800 text-slate-500 bg-white dark:bg-slate-950 px-2 rounded-md"
                      >
                        PROJ-{selectedProject.id.substring(0, 4).toUpperCase()}
                      </Badge>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                        {selectedProject.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs px-4"
                      >
                        Action
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    {/* MAIN VIEW */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-950">
                      <div className="max-w-[700px] mx-auto p-10 space-y-12">
                        <section>
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                            Project Overview
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base font-medium">
                            {selectedProject.description ||
                              "The scope of this project includes end-to-end development, stakeholder alignment, and final delivery milestones. All objectives are synced with client expectations."}
                          </p>
                        </section>

                        <section>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Execution Status
                            </h3>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              {progress}% Completed
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-800/40 shadow-inner">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                            Execution Log ({projectTasks.length})
                          </h3>
                          <div className="space-y-1">
                            {projectTasks.map((t) => (
                              <div
                                key={t.id}
                                className="group flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className={cn(
                                      "w-1.5 h-1.5 rounded-full shrink-0",
                                      t.status === "Done"
                                        ? "bg-emerald-500"
                                        : "bg-blue-500"
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "text-sm font-medium truncate",
                                      t.status === "Done"
                                        ? "text-slate-400 line-through"
                                        : "text-slate-700 dark:text-slate-200"
                                    )}
                                  >
                                    {t.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    {format(new Date(t.deadline), "MMM d")}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] font-bold px-1.5 py-0 h-4 border-slate-200 dark:border-slate-800 text-slate-400"
                                  >
                                    {t.priority.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            {projectTasks.length === 0 && (
                              <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-900 rounded-xl">
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                  No active tasks
                                </p>
                              </div>
                            )}
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* SIDEBAR VIEW */}
                    <div className="w-[300px] border-l border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto">
                      <div className="p-8 space-y-10">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Project Details
                          </h4>
                          <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> Remaining
                              </span>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {daysRemaining} Business Days
                              </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                <DollarSign className="w-3 h-3" /> Total Budget
                              </span>
                              <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                                ${selectedProject.budget.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                <Activity className="w-3 h-3" /> System Health
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    selectedProject.health === "On Track"
                                      ? "bg-emerald-500"
                                      : selectedProject.health === "At Risk"
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                  )}
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  {selectedProject.health.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-200/60 dark:border-slate-800">
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <Users className="w-3 h-3" /> Account Manager
                            </h4>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-950 shadow-sm border border-slate-100 dark:border-slate-800">
                                <AvatarImage src={manager?.avatar} />
                                <AvatarFallback className="text-[10px] font-bold">
                                  {manager?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {manager?.name || "Unassigned"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Head of Operations
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <Briefcase className="w-3 h-3" /> Stakeholder
                            </h4>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                                {client?.name.substring(0, 2).toUpperCase() ||
                                  "CL"}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {client?.name || "Unknown"}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {client?.company}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 text-center">
                          <Button
                            variant="ghost"
                            className="w-full h-8 text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900"
                          >
                            Archive Project
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
