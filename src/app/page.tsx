"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rocket, Shield, Users, Briefcase } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wrap in setTimeout to avoid synchronous state update warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleLogin = (role: UserRole) => {
    login(role);
    router.push("/dashboard");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-16 h-16 bg-linear-to-tr from-blue-600 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg"
            >
              <Rocket className="text-white w-8 h-8" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-600">
              ProjectPulse
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2 text-lg">
              Enterprise Performance OS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <motion.div variants={item}>
                <Button
                  variant="outline"
                  className="w-full h-16 text-lg justify-start px-6 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 group transition-all duration-300"
                  onClick={() => handleLogin("ADMIN")}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Admin Access
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      Full control & analytics
                    </span>
                  </div>
                </Button>
              </motion.div>

              <motion.div variants={item}>
                <Button
                  variant="outline"
                  className="w-full h-16 text-lg justify-start px-6 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 group transition-all duration-300"
                  onClick={() => handleLogin("MANAGER")}
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Manager Access
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      Team & Project Oversight
                    </span>
                  </div>
                </Button>
              </motion.div>

              <motion.div variants={item}>
                <Button
                  variant="outline"
                  className="w-full h-16 text-lg justify-start px-6 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 group transition-all duration-300"
                  onClick={() => handleLogin("MEMBER")}
                >
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Member Access
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      Tasks & Schedule
                    </span>
                  </div>
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
