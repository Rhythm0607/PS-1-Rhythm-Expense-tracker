"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">💰 ExpenseTracker</h1>
        <p className="text-slate-400">AI-powered expense management</p>
      </div>
    </div>
  );
}
