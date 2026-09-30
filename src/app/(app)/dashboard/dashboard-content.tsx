"use client";

import Link from "next/link";
import {
  FlaskConical,
  Scale,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { demoDashboardStats, demoRecentEvaluations, demoAuditLogs, demoUsers } from "@/lib/demo-data";
import type { EvaluationStatus } from "@/types";

// ============================================================
// Status Badge Component
// ============================================================

function StatusBadge({ status }: { status: EvaluationStatus }) {
  const config: Record<EvaluationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    draft: { label: "Draft", variant: "secondary", className: "bg-muted text-muted-foreground" },
    in_progress: { label: "In Progress", variant: "default", className: "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] border-0" },
    awaiting_review: { label: "Under Review", variant: "default", className: "bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)] border-0" },
    changes_requested: { label: "Changes Requested", variant: "default", className: "bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)] border-0" },
    approved: { label: "Approved", variant: "default", className: "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] border-0" },
    signed: { label: "Signed", variant: "default", className: "bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.5)] border-0" },
    completed: { label: "Completed", variant: "default", className: "bg-primary text-primary-foreground shadow-[0_0_10px_var(--color-primary)] border-0" },
    archived: { label: "Archived", variant: "secondary", className: "bg-muted text-muted-foreground" },
  };

  const c = config[status] || config.draft;
  return (
    <Badge variant={c.variant} className={`font-semibold tracking-wider text-[10px] uppercase px-2.5 py-0.5 ${c.className}`}>
      {c.label}
    </Badge>
  );
}

// ============================================================
// KPI Card Component
// ============================================================

function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  className?: string;
}) {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 cursor-pointer ${className || ""}`}>
      {/* Vibrant animated background glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Subtle left accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground tracking-[0.15em] uppercase group-hover:text-primary transition-colors">{title}</p>
            <p className="text-4xl font-extrabold tracking-tight tabular-nums text-foreground">{value}</p>
            {description && (
              <p className="text-xs font-medium text-muted-foreground/80 mt-1">{description}</p>
            )}
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-3.5 ring-1 ring-primary/30 shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_var(--color-primary)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Dashboard Content
// ============================================================

export function DashboardContent() {
  const stats = demoDashboardStats;
  const recentEvaluations = demoRecentEvaluations;
  const recentAudit = demoAuditLogs.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Laboratory overview and recent activity
          </p>
        </div>
        <Button asChild>
          <Link href="/evaluations/new">
            <Plus className="h-4 w-4 mr-2" />
            New Evaluation
          </Link>
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Active Evaluations"
          value={stats.active_evaluations}
          icon={FlaskConical}
          description="Currently in progress"
        />
        <KpiCard
          title="Instruments"
          value={stats.total_instruments}
          icon={Scale}
          description="Registered instruments"
        />
        <KpiCard
          title="Compliance Rate"
          value={`${stats.compliance_rate}%`}
          icon={TrendingUp}
          description="Overall pass rate"
        />
        <KpiCard
          title="Pending Review"
          value={stats.pending_reviews}
          icon={Clock}
          description="Awaiting reviewer action"
        />
      </div>

      {/* Second Row — Test results + Reports */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Tests Passed"
          value={stats.passed_tests}
          icon={CheckCircle2}
        />
        <KpiCard
          title="Tests Failed"
          value={stats.failed_tests}
          icon={XCircle}
        />
        <KpiCard
          title="Reports Generated"
          value={stats.reports_generated}
          icon={FileText}
        />
        <KpiCard
          title="Completed"
          value={stats.completed_evaluations}
          icon={AlertTriangle}
          description="Total completed evaluations"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Evaluations Table */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Evaluations</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/evaluations" className="text-xs">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <Link
                        href={`/evaluations/${evaluation.id}`}
                        className="font-medium hover:underline"
                      >
                        {evaluation.instrument_name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {evaluation.evaluation_number}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {evaluation.instrument_type}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={evaluation.status} />
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                      {new Date(evaluation.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity / Audit */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/audit" className="text-xs">
                  View All
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAudit.map((log) => {
                const user = demoUsers.find((u) => u.id === log.user_id);
                const actionLabels: Record<string, string> = {
                  "instrument.created": "registered a new instrument",
                  "evaluation.created": "created an evaluation",
                  "evaluation.started": "started an evaluation",
                  "observation.recorded": "recorded an observation",
                  "test.completed": "completed a test",
                  "evaluation.submitted": "submitted for review",
                  "evaluation.reviewed": "reviewed an evaluation",
                  "evaluation.approved": "approved an evaluation",
                  "report.generated": "generated a report",
                  "user.created": "created a user account",
                };
                return (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">
                          {user?.full_name || "Unknown"}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {actionLabels[log.action] || log.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(log.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
