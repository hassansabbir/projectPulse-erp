import { Client, Member, Project, Task } from "@/types";
import { addDays, subDays, format } from "date-fns";

export const mockMembers: Member[] = [
  {
    id: "m1",
    name: "Sarah Connor",
    email: "sarah@admin.com",
    role: "ADMIN",
    department: "Executive",
    joinDate: "2023-01-15",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: "m2",
    name: "John Doe",
    email: "john@manager.com",
    role: "MANAGER",
    department: "Development",
    joinDate: "2023-03-10",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "m3",
    name: "Jane Smith",
    email: "jane@member.com",
    role: "MEMBER",
    department: "Design",
    joinDate: "2023-04-20",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=jane",
  },
  {
    id: "m4",
    name: "Mike Ross",
    email: "mike@manager.com",
    role: "MANAGER",
    department: "Marketing",
    joinDate: "2023-05-01",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?u=mike",
  },
];

export const mockClients: Client[] = [
  {
    id: "c1",
    name: "Acme Corp",
    email: "contact@acme.com",
    company: "Acme Corporation",
    status: "Active",
    createdAt: "2023-01-01",
  },
  {
    id: "c2",
    name: "Globex",
    email: "info@globex.com",
    company: "Globex Corporation",
    status: "Lead",
    createdAt: "2023-06-15",
  },
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    clientId: "c1",
    title: "Website Redesign",
    budget: 15000,
    startDate: format(subDays(new Date(), 10), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 20), "yyyy-MM-dd"),
    managerId: "m2",
    status: "Active",
    health: "On Track",
    description: "Full redesign of the corporate website.",
  },
  {
    id: "p2",
    clientId: "c2",
    title: "Mobile App MVP",
    budget: 25000,
    startDate: format(subDays(new Date(), 5), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 45), "yyyy-MM-dd"),
    managerId: "m4",
    status: "Planning",
    health: "At Risk", // To demonstrate health
    description: "MVP for the new tracking app.",
  },
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    projectId: "p1",
    title: "Design Homepage",
    assignedTo: "m3",
    orderDate: format(subDays(new Date(), 9), "yyyy-MM-dd"),
    deadline: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    priority: "High",
    status: "In Progress",
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Setup CI/CD",
    assignedTo: "m3",
    orderDate: format(subDays(new Date(), 9), "yyyy-MM-dd"),
    deadline: format(addDays(new Date(), 5), "yyyy-MM-dd"),
    priority: "Medium",
    status: "To Do",
  },
];
