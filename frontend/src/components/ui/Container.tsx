"use client";

import React from "react";
import { motion } from "framer-motion";

interface ContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const maxWidths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({
  children,
  title,
  subtitle,
  actions,
  maxWidth = "full",
  className = "",
}: ContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full min-w-0 ${maxWidths[maxWidth]} ${className}`}
    >
      {(title || actions) && (
        <div className="mb-8 flex flex-col gap-4 border-b border-[var(--surface-border)] pb-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 max-w-2xl">
            {title && (
              <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground-muted)]">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
}