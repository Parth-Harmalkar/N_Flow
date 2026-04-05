"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/GlassCard";
import LogSubmissionForm from "@/components/employee/LogSubmissionForm";
import { Camera, FileCheck, History } from "lucide-react";

export default function EmployeeLogsPage() {
  return (
    <Container
      title="Submit work log"
      subtitle="Upload evidence and narrative in a dedicated workspace tile — same encryption as the dashboard terminal."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 md:gap-5">
        <Panel gridClassName="lg:col-span-4" className="bg-brand-primary text-white">
          <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3">
            <History className="h-6 w-6 text-brand-accent" />
          </div>
          <h3 className="text-lg font-black">Logging protocol</h3>
          <ul className="mt-4 space-y-3 text-sm font-medium text-white/70">
            <li className="flex gap-2">
              <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              Tie each log to an assigned task when possible.
            </li>
            <li className="flex gap-2">
              <Camera className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              Proof files are hashed and stored securely.
            </li>
          </ul>
        </Panel>

        <Panel gridClassName="lg:col-span-8" noPadding className="min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/40 px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submission form</p>
            <p className="text-sm font-medium text-slate-600">Complete all required fields before commit.</p>
          </div>
          <div className="p-6 md:p-8">
            <LogSubmissionForm />
          </div>
        </Panel>
      </div>
    </Container>
  );
}
