'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: React.ReactNode;
  /** Applied to the outer wrapper — use for grid placement (`lg:col-span-*`, `h-full`, etc.). */
  gridClassName?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'outline' | 'purple' | 'highlight';
  noPadding?: boolean;
  animate?: boolean;
}

export const Panel = ({ 
  children, 
  className = "",
  gridClassName,
  variant = 'default', 
  noPadding = false,
  animate = true
}: PanelProps) => {
  const variants = {
    default: "bg-white",
    elevated: "bg-white shadow-[var(--shadow-soft-xl)]",
    outline: "bg-white/50 border-2 border-surface-border backdrop-blur-xl",
    purple: "bg-brand-highlight text-white",
    highlight: "bg-brand-accent text-white shadow-2xl shadow-brand-accent/20",
  };

  const content = (
    <div className={cn(
      "fluid-card flex min-h-0 flex-col",
      !noPadding && "p-6 md:p-8 lg:p-10",
      variants[variant],
      "overflow-hidden",
      className
    )}>
      {children}
    </div>
  );

  const wrapClass = cn("min-h-0", gridClassName);

  if (!animate) {
    return <div className={wrapClass}>{content}</div>;
  }

  return (
    <motion.div
      className={wrapClass}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
};
