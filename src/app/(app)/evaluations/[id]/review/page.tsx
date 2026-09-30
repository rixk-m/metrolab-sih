"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, PenTool,
  Lock, FileText, Send, ArrowRight, Check, Hash, Award, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  demoEvaluations, demoInstruments, demoEvaluationTests, demoTestDefinitions,
  demoUsers, demoReports
} from "@/lib/demo-data";
import { useAuth } from "@/lib/auth-context";
import type { Report } from "@/types";
import { toast } from "sonner";

export default function ReviewAndApprovalPage({
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

  const instrument = demoInstruments.find((i) => i.id === evaluation.instrument_id) || demoInstruments[0];
  const tests = demoEvaluationTests.filter((t) => t.evaluation_id === evaluation.id);

  // Verification Checklist State
  const [checklist, setChecklist] = useState({
    environment: true,
    testsComplete: true,
    mpeCompliance: true,
    repeatability: true,
    eccentricity: true,
    calibrationCert: true,
  });

  const [reviewerRemarks, setReviewerRemarks] = useState(
    "All test observations recorded under controlled ambient conditions (20.8°C, 48.5% RH). Maximum observed error Ec is well within OIML R 76-1 Table 6 tolerances across all nominal load points. Recommended for Pattern Approval."
  );

  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [signingPin, setSigningPin] = useState("••••");
  const [isProcessing, setIsProcessing] = useState(false);

  const allChecked = Object.values(checklist).every(Boolean);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRequestChanges = () => {
    evaluation.status = "changes_requested";
    toast.warning("Evaluation flagged: Changes requested sent to Evaluator.");
    router.push(`/evaluations/${evaluation.id}`);
  };

  const handleApprove = () => {
    evaluation.status = "approved";
    toast.success("Evaluation approved! Ready for Approving Officer signature.");
    setIsSigningModalOpen(true);
  };

  const handleExecuteSignature = () => {
    setIsProcessing(true);
    setTimeout(() => {
      evaluation.status = "completed";
      evaluation.completed_at = new Date().toISOString();

      // Create new Report if not exists
      const reportNumber = `REP-2026-${String(demoReports.length + 10).padStart(4, "0")}`;
      const newReportId = `rep-${Date.now()}`;
      const newReport: Report = {
        id: newReportId,
        report_number: reportNumber,
        evaluation_id: evaluation.id,
        version: 1,
        status: "approved",
        generated_by: user?.id || "usr-004",
        approved_by: user?.id || "usr-004",
        generated_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        content_snapshot: {
          title: `OIML R 76-1 Pattern Evaluation Report — ${instrument.model_name}`,
          summary: `Type evaluation certificate for ${instrument.model_name} (Class ${instrument.accuracy_class}, Max ${instrument.max_capacity} ${instrument.unit}). Complies with OIML R 76-1:2006.`,
          conclusions: "The instrument satisfies all applicable metrological and technical requirements of OIML Recommendation R 76-1 (Edition 2006).",
        },
        file_path: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      demoReports.unshift(newReport);
      setIsProcessing(false);
      toast.success(`Cryptographic signature applied! Report ${reportNumber} generated.`);
      router.push(`/reports/${newReportId}`);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/evaluations/${evaluation.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Review & Conformity Approval</h1>
            <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/20">
              {evaluation.evaluation_number}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Technical audit and digital sign-off per OIML R 76 Type Evaluation workflow
          </p>
        </div>
      </div>

      {/* Evaluation & Instrument Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Conformity Summary</span>
            <Badge variant="outline" className="capitalize text-xs">
              Status: {evaluation.status.replace("_", " ")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 rounded-lg bg-muted/50 border border-border/60">
            <div>
              <span className="text-muted-foreground">Instrument:</span>
              <p className="font-semibold text-foreground mt-0.5">{instrument.model_name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Accuracy Class:</span>
              <p className="font-mono font-semibold text-foreground mt-0.5">Class {instrument.accuracy_class}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Intervals Count (n):</span>
              <p className="font-mono font-semibold text-foreground mt-0.5">
                {(instrument.num_intervals || 15000).toLocaleString()} e
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Tests Executed:</span>
              <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {tests.length} of {tests.length} Complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviewer Inspection Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Metrological Inspection Checklist
          </CardTitle>
          <CardDescription>
            The technical reviewer must verify each item prior to formal authorization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              key: "environment" as const,
              title: "Laboratory Conditions Traceability",
              desc: "Ambient temperature (20.8°C), humidity (48.5%), and pressure stable within Clause A.4 tolerances.",
            },
            {
              key: "testsComplete" as const,
              title: "Applicable Test Suites Complete",
              desc: "Weighing Performance, Repeatability, Eccentricity, and Tare tests executed without omission.",
            },
            {
              key: "mpeCompliance" as const,
              title: "Maximum Permissible Error (MPE) Verification",
              desc: "Zero-corrected errors Ec ≤ ±0.5e, ±1.0e, and ±1.5e per OIML R 76-1 Table 6 thresholds.",
            },
            {
              key: "repeatability" as const,
              title: "Repeatability Dispersion Limits (Clause 3.6.1)",
              desc: "Maximum difference between successive readings at 0.5 Max and Max is within |MPE|.",
            },
            {
              key: "eccentricity" as const,
              title: "Eccentric Loading Limits (Clause 3.6.2)",
              desc: "Four eccentric corners and central position errors do not exceed applicable MPE.",
            },
            {
              key: "calibrationCert" as const,
              title: "Working Standards Calibration Traceability",
              desc: "Reference standard test weights carry valid ISO/IEC 17025 calibration certificates.",
            },
          ].map((item) => {
            const checked = checklist[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                  checked
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border/60 hover:bg-muted/40 opacity-70"
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border shrink-0 ${
                    checked
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-muted-foreground"
                  }`}
                >
                  {checked && <Check className="h-3 w-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Reviewer Remarks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reviewer Remarks & Recommendation</CardTitle>
          <CardDescription>
            Official remarks recorded into the immutable audit trail and final certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-[90px] p-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans"
            value={reviewerRemarks}
            onChange={(e) => setReviewerRemarks(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/40 pt-3">
          <Button variant="outline" onClick={handleRequestChanges} className="text-destructive hover:bg-destructive/10">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Request Modifications
          </Button>

          <Button onClick={handleApprove} disabled={!allChecked} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Approve & Authorize Digital Signature
          </Button>
        </CardFooter>
      </Card>

      {/* Approving Officer Digital Signature Modal / Card */}
      {isSigningModalOpen && (
        <Card className="border-primary ring-2 ring-primary/20 shadow-xl bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Award className="h-5 w-5" />
              <span>Approving Officer Digital Sign-Off</span>
            </div>
            <CardDescription>
              Apply cryptographic digital signature to issue the OIML R 76-1 Type Approval Certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-lg bg-muted/60 border border-border/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signatory:</span>
                <span className="font-semibold text-foreground">{user?.full_name} ({user?.role.replace("_", " ")})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Authority:</span>
                <span className="text-foreground">National Legal Metrology Directorate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hash Algorithm:</span>
                <span className="font-mono text-primary">SHA-256 (FIPS 180-4 compliant)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Simulated Token:</span>
                <span className="font-mono text-[10px] text-muted-foreground truncate max-w-xs">
                  8f4e2b09a1c7d354b8e91024fcba9321ef778a01
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Authorization Security PIN</label>
              <Input
                type="password"
                value={signingPin}
                onChange={(e) => setSigningPin(e.target.value)}
                className="font-mono text-sm max-w-xs"
                placeholder="Enter 4-digit PIN"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-border/40 pt-3">
            <Button variant="outline" onClick={() => setIsSigningModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExecuteSignature}
              disabled={isProcessing}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isProcessing ? "Affixing Cryptographic Signature..." : "Sign & Issue Certificate"}
              <Lock className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
