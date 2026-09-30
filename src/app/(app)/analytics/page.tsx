"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoDashboardStats } from "@/lib/demo-data";

export default function AnalyticsPage() {
  const stats = demoDashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Evaluation trends, compliance metrics, and laboratory workload analysis
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Instruments", value: stats.total_instruments },
          { label: "Evaluations Completed", value: stats.completed_evaluations },
          { label: "Overall Compliance", value: `${stats.compliance_rate}%` },
          { label: "Reports Generated", value: stats.reports_generated },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-3xl font-bold tracking-tight mt-1 tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-emerald-500/20 rounded-t" style={{ height: `${(stats.passed_tests / (stats.passed_tests + stats.failed_tests)) * 100}%` }}>
                  <div className="w-full h-full bg-emerald-500 rounded-t opacity-60" />
                </div>
                <span className="text-xs text-muted-foreground">Pass</span>
                <span className="text-sm font-bold">{stats.passed_tests}</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-red-500/20 rounded-t" style={{ height: `${(stats.failed_tests / (stats.passed_tests + stats.failed_tests)) * 100}%` }}>
                  <div className="w-full h-full bg-red-500 rounded-t opacity-60" />
                </div>
                <span className="text-xs text-muted-foreground">Fail</span>
                <span className="text-sm font-bold">{stats.failed_tests}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evaluation Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Active / In Progress", value: stats.active_evaluations, color: "bg-blue-500" },
                { label: "Completed", value: stats.completed_evaluations, color: "bg-emerald-500" },
                { label: "Pending Review", value: stats.pending_reviews, color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-sm flex-1">{item.label}</span>
                  <span className="text-sm font-bold tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
