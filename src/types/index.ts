export type UserRole = "ADMIN" | "MANAGER" | "MEMBER";

export type ClientStatus = "Active" | "Inactive" | "Lead";
export type ProjectStatus =
  | "Planning"
  | "Active"
  | "Completed"
  | "On Hold"
  | "Cancelled";
export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";
export type ProjectHealth = "On Track" | "At Risk" | "Delayed" | "Failed";

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: ClientStatus;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinDate: string;
  status: "Active" | "Inactive";
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  budget: number;
  startDate: string;
  endDate: string; // Deadline
  managerId?: string;
  description?: string;
  status: ProjectStatus;
  health: ProjectHealth;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignedTo?: string; // Member ID
  orderDate: string;
  deadline: string;
  deliveryDate?: string;
  priority: "Low" | "Medium" | "High";
  status: TaskStatus;
}
