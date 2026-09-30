"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, FlaskConical, Scale, Thermometer, CheckCircle2,
  AlertTriangle, Clock, ArrowRight, FileText, Check, ShieldCheck,
  Send, ExternalLink, RefreshCw, PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  demoEvaluations, demoInstruments, demoEvaluationTests, demoTestDefinitions,
  demoUsers, demoReports
} from "@/lib/demo-data";
import { useAuth } from "@/lib/auth-context";
import type { EvaluationStatus, TestStatus } from "@/types";
import { toast } from "sonner";

export default function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [evaluation, setEvaluation] = useState(() => {
    return demoEvaluations.find((e) => e.id === resolvedParams.id) || demoEvaluations[0];
  });

  const instrument = demoInstruments.find((i) => i.id === evaluation.instrument_id);
  const evaluator = demoUsers.find((u) => u.id === evaluation.evaluator_id);
  const reviewer = demoUsers.find((u) => u.id === evaluation.reviewer_id);
  const approver = demoUsers.find((u) => u.id === evaluation.approver_id);

  // Tests for this evaluation
  const tests = demoEvaluationTests.filter((t) => t.evaluation_id === evaluation.id);
  const existingReport = demoReports.find((r) => r.evaluation_id === evaluation.id);

  const completedCount = tests.filter((t) => t.status === "completed").length;
  const totalCount = tests.length || 1;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // Status transitions
  const handleStatusChange = (newStatus: EvaluationStatus) => {
    const updated = { ...evaluation, status: newStatus, updated_at: new Date().toISOString() };
    setEvaluation(updated);
    const idx = demoEvaluations.findIndex((e) => e.id === evaluation.id);
    if (idx !== -1) {
      demoEvaluations[idx] = updated;
    }
    toast.success(`Evaluation status updated to ${newStatus.replace("_", " ")}`);
  };

  const lifecycleStages: { key: EvaluationStatus; label: string }[] = [
    { key: "draft", label: "Draft" },
    { key: "in_progress", label: "In Progress" },
    { key: "awaiting_review", label: "Under Review" },
    { key: "approved", label: "Approved" },
    { key: "signed", label: "Signed" },
    { key: "completed", label: "Completed" },
  ];

  const currentStageIndex = lifecycleStages.findIndex((s) => s.key === evaluation.status);

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/evaluations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight font-mono">
                {evaluation.evaluation_number}
              </h1>
              <Badge variant="outline" className="text-xs uppercase bg-primary/10 text-primary border-primary/20">
                {evaluation.evaluation_type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Standard: <span className="font-mono text-foreground">{evaluation.applicable_ruleset_id || "OIML R 76-1:2006"}</span> · Evaluator: {evaluator?.full_name || "Assigned Engineer"}
            </p>
          </div>
        </div>

        {/* Quick Lifecycle Action Buttons */}
        <div className="flex items-center gap-2">
          {evaluation.status === "in_progress" && (
            <Button
              onClick={() => handleStatusChange("awaiting_review")}
              className="gap-2"
              variant="default"
            >
              <Send className="h-4 w-4" />
              Submit for Review
            </Button>
          )}

          {(evaluation.status === "awaiting_review" || evaluation.status === "approved" || evaluation.status === "in_progress") && (
            <Button asChild variant="outline">
              <Link href={`/evaluations/${evaluation.id}/review`}>
                <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                Review & Sign-Off
              </Link>
            </Button>
          )}

          {existingReport && (
            <Button asChild variant="secondary">
              <Link href={`/reports/${existingReport.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider">
              Evaluation Lifecycle State
            </span>
            <span className="font-mono font-medium text-primary">
              {completedCount} of {totalCount} tests executed ({progressPct}%)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
            {lifecycleStages.map((stage, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;
              return (
                <div
                  key={stage.key}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                      : isPast
                      ? "border-border/60 bg-muted/30 text-foreground"
                      : "border-border/30 text-muted-foreground/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {isPast ? (
                      <Check className="h-3 w-3 text-primary shrink-0" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    )}
                    <span className="text-[10px] font-mono uppercase">0{idx + 1}</span>
                  </div>
                  <p className="text-xs truncate">{stage.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Instrument & Laboratory Conditions Grid */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Instrument Snapshot */}
        <Card className="md:col-span-6">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Instrument Under Test
              </CardTitle>
              <CardDescription>
                Unit submitted for OIML R 76 conformity assessment
              </CardDescription>
            </div>
            {instrument && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/instruments/${instrument.id}`}>
                  View Details
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {instrument ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Model Designation:</span>
                  <span className="font-semibold text-foreground">{instrument.model_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Serial Number:</span>
                  <span className="font-mono text-foreground">{instrument.serial_number}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Accuracy Classification:</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Class {instrument.accuracy_class}
                  </Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Capacity Range (Min - Max):</span>
                  <span className="font-mono text-foreground">
                    {instrument.min_capacity} - {instrument.max_capacity} {instrument.unit}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Verification Interval (e / d):</span>
                  <span className="font-mono text-foreground">
                    e = {instrument.verification_scale_interval || instrument.scale_interval} {instrument.unit} (d = {instrument.scale_interval} {instrument.unit})
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Instrument record not found.</p>
            )}
          </CardContent>
        </Card>

        {/* Laboratory Environmental Conditions */}
        <Card className="md:col-span-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-primary" />
              Laboratory Environmental Traceability
            </CardTitle>
            <CardDescription>
              Controlled conditions during verification per Clause A.4
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">Temperature</span>
                <p className="text-lg font-mono font-bold mt-0.5">
                  {evaluation.temperature || 20.5}°C
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Stable ±0.2</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">Humidity</span>
                <p className="text-lg font-mono font-bold mt-0.5">
                  {evaluation.humidity || 50.0}%
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Within 30-70%</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-center">
                <span className="text-[10px] text-muted-foreground uppercase">Pressure</span>
                <p className="text-lg font-mono font-bold mt-0.5">
                  {evaluation.barometric_pressure || 101.32} <span className="text-xs font-normal">kPa</span>
                </p>
                <span className="text-[10px] text-muted-foreground">Standard</span>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference Standards:</span>
                <span className="font-medium text-foreground">
                  {evaluation.reference_standards || "OIML Class E2 / F1 Standard Weights"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Laboratory:</span>
                <span className="font-medium text-foreground">
                  National Legal Metrology Center (Accredited ISO/IEC 17025)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Execution Workspace Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              OIML R 76-1 Test Suites Execution Workspace
            </CardTitle>
            <CardDescription>
              Execute individual test procedures, log load observations, and compute real-time MPE compliance
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clause / Code</TableHead>
                <TableHead>Test Procedure</TableHead>
                <TableHead>Standard Ref</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance Verdict</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-muted-foreground text-xs">
                    No test procedures assigned to this evaluation.
                  </TableCell>
                </TableRow>
              ) : (
                tests.map((test) => {
                  const def = demoTestDefinitions.find((d) => d.id === test.test_definition_id) || test.test_definition;
                  const isCompleted = test.status === "completed";
                  const isInProgress = test.status === "in_progress";

                  return (
                    <TableRow key={test.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {def?.code || "A.4.4"}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{def?.name || "Test Suite"}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {def?.description}
                        </p>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {def?.standard_reference || "OIML R 76-1:2006"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300"
                              : isInProgress
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-300"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {test.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isCompleted ? (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            PASS (Within MPE)
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-mono">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                          asChild
                        >
                          <Link href={`/evaluations/${evaluation.id}/tests/${test.id}`}>
                            {isCompleted ? "Review Data" : "Open Workspace"}
                            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
