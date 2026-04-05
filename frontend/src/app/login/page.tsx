"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ShieldCheck } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { login } from "@/app/auth/actions/login";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-neon-blue/20 text-neon-blue shadow-[0_0_20px_rgba(0,210,255,0.3)]"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            N-FLOW
          </h1>
          <p className="text-gray-400">Employee Monitoring & Task Management</p>
        </div>

        <GlassCard className="relative overflow-hidden border-white/5 bg-white/5 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all focus:border-neon-blue/50 focus:bg-white/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all focus:border-neon-blue/50 focus:bg-white/10"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-medium text-red-400"
              >
                {error}
              </motion.p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="group relative w-full overflow-hidden rounded-2xl bg-white p-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Decorative gradients inside card */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-neon-blue/10 blur-xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-neon-purple/10 blur-xl" />
        </GlassCard>

        <p className="mt-8 text-center text-sm text-gray-500">
          Admin access required for employee registration.
        </p>
      </motion.div>
    </div>
  );
}
