import React from "react";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { getGlobalPerformanceMetrics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  // Fetch real-time metrics for the dashboard
  const metrics = await getGlobalPerformanceMetrics();

  return <AnalyticsDashboard metrics={metrics} />;
}