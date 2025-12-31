"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Mail,
  Building,
  Phone,
  MoreHorizontal,
  Briefcase,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { format } from "date-fns";
import { Client } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const { clients, addClient, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    email: "",
    company: "",
    status: "Active",
  });

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!newClient.name || !newClient.email) return;
    const client: Client = {
      ...(newClient as Client),
      id: Math.random().toString(36).substring(2, 9),
      createdAt: format(new Date(), "yyyy-MM-dd"),
    };
    addClient(client);
    setIsDialogOpen(false);
    setNewClient({ name: "", email: "", company: "", status: "Active" });
  };

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-full flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Access Restricted
          </h2>
          <p className="text-slate-500 max-w-sm text-sm font-medium">
            Only administrative personnel are authorized to manage client
            portfolios and partnership accounts.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 font-bold border-slate-200"
          onClick={() => window.history.back()}
        >
          Return to Terminal
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 font-sans">
      {/* Client Action Bar */}
      <div className="p-6 pb-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search portfolio by name or company..."
              className="pl-9 h-9 w-[320px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs shadow-xs focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" />
            {clients.length} Active Partners
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 font-bold px-4 h-9 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Register Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                New Account Provisioning
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Stakeholder Name
                </Label>
                <Input
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                  placeholder="Legal name of contact"
                  className="h-10"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Corporate Email
                </Label>
                <Input
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  placeholder="contact@company.com"
                  className="h-10"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Organization / Firm
                </Label>
                <Input
                  value={newClient.company}
                  onChange={(e) =>
                    setNewClient({ ...newClient, company: e.target.value })
                  }
                  placeholder="Entity legal name"
                  className="h-10"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Direct Line (Optional)
                </Label>
                <Input
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phone: e.target.value })
                  }
                  placeholder="+1 (000) 000-0000"
                  className="h-10"
                />
              </div>
              <Button
                onClick={handleCreate}
                className="h-11 bg-blue-600 font-bold mt-2"
              >
                Initialize Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enterprise Partner Table */}
      <div className="p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Partner Context
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Entity
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Communication
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Lifecycle
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Connection Date
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-950 border border-slate-100 dark:border-slate-800 shadow-xs">
                        <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-black">
                          {client.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {client.company || "Direct Individual"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                        <Mail className="w-3 h-3" /> {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                          <Phone className="w-3 h-3" /> {client.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-black px-1.5 py-0 border-transparent rounded h-5 uppercase tracking-tighter",
                        client.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      )}
                    >
                      {client.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter tabular-nums">
                      <ChevronRight className="w-3 h-3" />
                      {format(new Date(client.createdAt), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold uppercase tracking-widest text-rose-500">
                          Terminate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
