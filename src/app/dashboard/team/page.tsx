"use client";

import { useStore } from "@/store/useStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Mail,
  Briefcase,
  Users,
  Search,
  ArrowUpRight,
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  Shield,
  Target,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Member, Project } from "@/types";

export default function TeamPage() {
  const { members, projects, tasks, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // --- Derived Data Logic ---
  const getMemberStats = (memberId: string) => {
    // 1. Projects they manage directly
    const managedProjects = projects.filter((p) => p.managerId === memberId);

    // 2. Projects they have contributed to (via tasks)
    const memberTasks = tasks.filter((t) => t.assignedTo === memberId);
    const contributedProjectIds = new Set(memberTasks.map((t) => t.projectId));
    const contributedProjects = projects.filter(
      (p) => contributedProjectIds.has(p.id) && p.managerId !== memberId // Exclude if already managed
    );

    // 3. Combine and Deduplicate (though logic above handles overlap)
    const allMemberProjects = [...managedProjects, ...contributedProjects];

    const completedTasks = memberTasks.filter((t) => t.status === "Done");

    // Calculate Project Success Rate (based on Health of all associated projects)
    const successProjects = allMemberProjects.filter(
      (p) => p.health === "On Track" || p.status === "Completed"
    ).length;
    const projectSuccessRate =
      allMemberProjects.length > 0
        ? Math.round((successProjects / allMemberProjects.length) * 100)
        : 100;

    // Calculate Task Efficiency
    const taskEfficiency =
      memberTasks.length > 0
        ? Math.round((completedTasks.length / memberTasks.length) * 100)
        : 0;

    return {
      assignedProjects: allMemberProjects.length,
      assignedTasks: memberTasks.length,
      completedTasks: completedTasks.length,
      projectSuccessRate,
      taskEfficiency,
      projects: allMemberProjects, // Now includes BOTH managed and contributed
      tasks: memberTasks,
    };
  };

  const getProjectRole = (memberId: string, project: Project) => {
    if (project.managerId === memberId) return "Lead Manager";
    return "Contributor";
  };

  const handleRowClick = (member: Member) => {
    setSelectedMember(member);
    setIsDetailsOpen(true);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMemberStats = selectedMember
    ? getMemberStats(selectedMember.id)
    : null;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 font-sans">
      {/* Team Toolbar */}
      <div className="p-6 pb-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search team by name or role..."
              className="pl-9 h-9 w-[300px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs shadow-xs focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            {members.length} Human Capital Assets
          </div>
        </div>
        {currentUser?.role === "ADMIN" && (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 font-bold px-4 h-9 shadow-xs"
          >
            Add Operations Personnel
          </Button>
        )}
      </div>

      {/* Enterprise Team Table */}
      <div className="p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Resource Context
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Position & Domain
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Contact Vector
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Assignment Index
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Performance Index
                </TableHead>
                <TableHead className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                  Records
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => {
                const stats = getMemberStats(member.id);
                const perfValue = ((member.name.length * 7) % 30) + 70;
                return (
                  <TableRow
                    key={member.id}
                    onClick={() => handleRowClick(member)}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-950 border border-slate-100 dark:border-slate-800 shadow-xs">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-[10px] font-black">
                            {member.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                            {member.name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Joined{" "}
                            {format(new Date(member.joinDate), "MMM yyyy")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {member.role}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4.5">
                          {member.department || "Operations"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />{" "}
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                            {stats.assignedProjects}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">
                            Projects
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                            {stats.assignedTasks}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">
                            Deliverables
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 w-40">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Score</span>
                          <span className="text-blue-600 dark:text-blue-400 font-black">
                            {perfValue}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${perfValue}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Member Details Modal - Enterprise Grade Redesign */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[90vw] w-full h-[85vh] p-0 gap-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl sm:rounded-xl">
          {selectedMember && selectedMemberStats && (
            <>
              {/* Header Section: Profile & Core Context */}
              <div className="flex items-start justify-between p-8 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-950 shrink-0">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
                      <AvatarImage src={selectedMember.avatar} />
                      <AvatarFallback className="text-xl font-bold bg-slate-100 text-slate-600">
                        {selectedMember.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-white dark:border-slate-950 flex items-center justify-center",
                        selectedMember.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      )}
                    >
                      {selectedMember.status === "Active" && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                      {selectedMember.name}
                      <Badge
                        variant="outline"
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border-slate-200 text-slate-500"
                      >
                        {selectedMember.role}
                      </Badge>
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {selectedMember.department || "Operations"}
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {selectedMember.email}
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Joined{" "}
                        {format(new Date(selectedMember.joinDate), "MMM yyyy")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-slate-200 text-slate-600 font-semibold"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  {currentUser?.role === "ADMIN" && (
                    <Button
                      size="sm"
                      className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Main Content: Split View */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left: Performance Metrics (KPIs) - Fixed Width */}
                <div className="w-[320px] shrink-0 bg-slate-50/50 dark:bg-slate-900/30 border-r border-slate-100 dark:border-slate-800/60 p-8 space-y-8 overflow-y-auto">
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      Performance Indices
                    </h3>

                    <div className="space-y-4">
                      {/* KPI 1 */}
                      <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Project Success
                          </span>
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedMemberStats.projectSuccessRate}%
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Based on {selectedMemberStats.assignedProjects}{" "}
                          assigned projects
                        </div>
                      </div>

                      {/* KPI 2 */}
                      <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Task Efficiency
                          </span>
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedMemberStats.taskEfficiency}%
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {selectedMemberStats.completedTasks}/
                          {selectedMemberStats.assignedTasks} tasks completed
                        </div>
                      </div>

                      {/* KPI 3 */}
                      <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Delivery Speed
                          </span>
                          <Clock className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          94%
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Avg. 1.2 days ahead of schedule
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      Access & Role
                    </h3>
                    <div className="text-xs text-slate-500 leading-relaxed">
                      User has{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedMember.role}
                      </span>{" "}
                      privileges. Authorized to access{" "}
                      {selectedMember.role === "ADMIN"
                        ? "all system modules"
                        : "assigned project workspaces only"}
                      .
                    </div>
                  </div>
                </div>

                {/* Right: Project Portfolio Table */}
                <div className="flex-1 bg-white dark:bg-slate-950 p-8 overflow-y-auto">
                  <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    Active Portfolio
                  </h3>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Project
                          </TableHead>
                          <TableHead className="h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Role
                          </TableHead>
                          <TableHead className="h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Status
                          </TableHead>
                          <TableHead className="h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Health
                          </TableHead>
                          <TableHead className="h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">
                            Contribution
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMemberStats.projects.length > 0 ? (
                          selectedMemberStats.projects.map((project) => (
                            <TableRow
                              key={project.id}
                              className="hover:bg-slate-50/50 group transition-colors"
                            >
                              <TableCell className="py-3 font-semibold text-sm text-slate-700 dark:text-slate-200">
                                {project.title}
                              </TableCell>
                              <TableCell className="py-3">
                                <span className="text-xs font-medium text-slate-500">
                                  {getProjectRole(selectedMember.id, project)}
                                </span>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-600 font-semibold border-transparent hover:bg-slate-200 shadow-none"
                                >
                                  {project.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      project.health === "On Track"
                                        ? "bg-emerald-500"
                                        : project.health === "At Risk"
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    )}
                                  />
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {project.health}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3 text-right">
                                <span className="font-mono text-xs font-bold text-slate-500">
                                  100%
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-slate-400 text-xs italic"
                            >
                              No managed projects in history.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Recent Activity Mini-Section */}
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                      Recent Deliverables
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedMemberStats.tasks.slice(0, 4).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                        >
                          <div
                            className={cn(
                              "w-1 h-8 rounded-full",
                              task.priority === "High"
                                ? "bg-rose-500"
                                : task.priority === "Medium"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            )}
                          />
                          <div className="overflow-hidden">
                            <div className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                              {task.title}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                              {task.status} •{" "}
                              {format(new Date(task.deadline), "MMM d")}
                            </div>
                          </div>
                        </div>
                      ))}
                      {selectedMemberStats.tasks.length === 0 && (
                        <div className="col-span-2 text-xs text-slate-400 italic">
                          No recent tasks found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
