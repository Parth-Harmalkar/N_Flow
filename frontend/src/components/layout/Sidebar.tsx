'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  ClipboardList, 
  BarChart3, 
  LogOut,
  Clock,
  History,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: 'admin' | 'employee';
}

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
    { name: 'Personnel', href: '/admin/users', icon: Users },
    { name: 'Logs', href: '/admin/logs', icon: ClipboardList },
    { name: 'Risks', href: '/admin/risks', icon: AlertCircle },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const employeeLinks = [
    { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/employee/tasks', icon: Clock },
    { name: 'Submit Log', href: '/employee/logs', icon: History },
  ];

  const links = role === 'admin' ? adminLinks : employeeLinks;

  return (
    <aside className="z-50 flex w-24 shrink-0 flex-col items-center self-stretch rounded-2xl bg-brand-primary py-8 text-white shadow-[0_24px_50px_-12px_rgba(30,27,75,0.45)] ring-1 ring-white/10 md:w-28 lg:w-32 lg:rounded-[1.25rem]">
      {/* Branding */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/5 shadow-inner">
          <span className="text-brand-accent font-black text-2xl italic">N</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-6 items-center">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative p-4 rounded-3xl transition-all duration-300",
                isActive 
                  ? "bg-brand-accent text-brand-primary shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip on Hover */}
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                {link.name}
              </div>

              {isActive && (
                <motion.div
                  layoutId="active-glow"
                  className="absolute inset-0 bg-brand-accent/20 blur-xl -z-10 rounded-full"
                  transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button className="p-4 rounded-3xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group relative">
        <LogOut className="w-6 h-6" />
        <div className="absolute left-full ml-4 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
          Logout
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;
