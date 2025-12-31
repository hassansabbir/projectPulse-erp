import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Client, Member, Project, Task, UserRole } from "@/types";
import {
  mockClients,
  mockMembers,
  mockProjects,
  mockTasks,
} from "@/lib/mockData";

interface AppState {
  currentUser: Member | null;
  members: Member[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];

  // Actions
  login: (role: UserRole) => void;
  logout: () => void;

  // Data Actions
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  resetData: () => void; // Debugging
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      members: mockMembers, // Always start with mock members available for login simulation
      clients: [],
      projects: [],
      tasks: [],

      login: (role) => {
        // Find a mock member with this role to impersonate
        const user = mockMembers.find((m) => m.role === role);
        if (user) {
          set({ currentUser: user });

          // If first login (no data), seed data
          const state = get();
          if (state.clients.length === 0) {
            set({
              clients: mockClients,
              projects: mockProjects,
              tasks: mockTasks,
            });
          }
        }
      },

      logout: () => set({ currentUser: null }),

      addClient: (client) =>
        set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, data) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      deleteClient: (id) =>
        set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, data) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      resetData: () =>
        set({
          clients: mockClients,
          projects: mockProjects,
          tasks: mockTasks,
          members: mockMembers,
        }),
    }),
    {
      name: "project-pulse-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
