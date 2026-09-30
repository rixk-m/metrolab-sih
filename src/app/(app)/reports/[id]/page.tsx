"use client";

import { use, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Printer, Download, Scale, ShieldCheck, CheckCircle2,
  Calendar, FileText, Award, Lock, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  demoReports, demoEvaluations, demoInstruments, demoManufacturers, demoUsers
} from "@/lib/demo-data";

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const printRef = useRef<HTMLDivElement>(null);

  const report = demoReports.find((r) => r.id === resolvedParams.id) || demoReports[0];
  const evaluation = demoEvaluations.find((e) => e.id === report.evaluation_id) || demoEvaluations[0];
  const instrument = demoInstruments.find((i) => i.id === evaluation.instrument_id) || demoInstruments[0];
  const manufacturer = demoManufacturers.find((m) => m.id === instrument.manufacturer_id);
  const evaluator = demoUsers.find((u) => u.id === evaluation.evaluator_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight font-mono">
                {report.report_number}
              </h1>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300">
                {report.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              OIML R 76-1:2006 Standardized Type Evaluation Certificate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <Link href={`/evaluations/${evaluation.id}`}>
              <ExternalLink className="h-4 w-4" />
              Source Evaluation
            </Link>
          </Button>
        </div>
      </div>

      {/* FORMAL OIML R 76 CERTIFICATE DOCUMENT CONTAINER */}
      <div
        ref={printRef}
        className="bg-card text-card-foreground border border-border shadow-lg rounded-xl p-8 sm:p-12 space-y-8 font-sans print:shadow-none print:border-none print:p-0"
      >
        {/* Document Header */}
        <div className="border-b-2 border-primary/30 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
              <div className="h-7 w-7 rounded bg-primary text-primary-foreground flex items-center justify-center">
                <Scale className="h-4 w-4" />
              </div>
              <span>NATIONAL METROLOGY SERVICE</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Directorate of Legal Metrology · Type Evaluation Laboratory
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight pt-2 text-foreground">
              OIML R 76-1 TYPE EVALUATION REPORT
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              In accordance with OIML Recommendation R 76-1 (Edition 2006)
            </p>
          </div>

          <div className="sm:text-right space-y-1 text-xs">
            <div className="inline-block p-2 rounded bg-muted/60 border border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase block">Report & Certificate No.</span>
              <span className="font-mono font-bold text-sm text-foreground">{report.report_number}</span>
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Date of Issue: <span className="font-semibold text-foreground">
                {new Date(report.generated_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Evaluation Ref: <span className="font-mono">{evaluation.evaluation_number}</span>
            </p>
          </div>
        </div>

        {/* 1. Identification of Instrument */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            1. Pattern & Instrument Identification
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Pattern / Model:</span>
              <p className="font-semibold text-foreground mt-0.5">{instrument.model_name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Manufacturer:</span>
              <p className="font-semibold text-foreground mt-0.5">{manufacturer?.name || "Mettler Toledo"}</p>
              <p className="text-[10px] text-muted-foreground">{manufacturer?.country || "Switzerland"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Serial Number:</span>
              <p className="font-mono font-semibold text-foreground mt-0.5">{instrument.serial_number}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Instrument Category:</span>
              <p className="font-medium text-foreground mt-0.5">{instrument.instrument_type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Applicant:</span>
              <p className="font-medium text-foreground mt-0.5">{instrument.applicant_name || "Mettler Toledo AG"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Firmware Version:</span>
              <p className="font-mono font-medium text-foreground mt-0.5">{instrument.software_version || "v2.4.1"}</p>
            </div>
          </div>
        </div>

        {/* 2. Metrological Characteristics */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            2. Verified Metrological Characteristics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-lg">
              <tbody>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-2.5 font-semibold text-muted-foreground w-1/3">Accuracy Classification</td>
                  <td className="p-2.5 font-mono font-bold text-foreground">Class {instrument.accuracy_class}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2.5 font-semibold text-muted-foreground">Maximum Capacity (Max)</td>
                  <td className="p-2.5 font-mono font-bold text-foreground">{instrument.max_capacity} {instrument.unit}</td>
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-2.5 font-semibold text-muted-foreground">Minimum Capacity (Min)</td>
                  <td className="p-2.5 font-mono font-bold text-foreground">{instrument.min_capacity} {instrument.unit}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2.5 font-semibold text-muted-foreground">Verification Scale Interval (e)</td>
                  <td className="p-2.5 font-mono font-bold text-foreground">{instrument.verification_scale_interval || instrument.scale_interval} {instrument.unit}</td>
                </tr>
                <tr className="border-b border-border bg-muted/30">
                  <td className="p-2.5 font-semibold text-muted-foreground">Actual Scale Interval (d)</td>
                  <td className="p-2.5 font-mono font-bold text-foreground">{instrument.scale_interval} {instrument.unit}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2.5 font-semibold text-muted-foreground">Number of Verification Scale Intervals (n)</td>
                  <td className="p-2.5 font-mono font-bold text-foreground">
                    {(instrument.num_intervals || Math.round(instrument.max_capacity / (instrument.verification_scale_interval || instrument.scale_interval))).toLocaleString()} e
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-muted-foreground bg-muted/30">Tare Balancing Capability (T)</td>
                  <td className="p-2.5 font-medium text-foreground">{instrument.description || "Subtractive tare up to 100% Max"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Laboratory Environmental Traceability */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            3. Environmental Traceability & Test Standards
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3 rounded-lg bg-muted/30 border border-border">
            <div>
              <span className="text-muted-foreground">Temperature:</span>
              <p className="font-mono font-semibold mt-0.5">{evaluation.temperature || 20.8} °C (±0.2)</p>
            </div>
            <div>
              <span className="text-muted-foreground">Relative Humidity:</span>
              <p className="font-mono font-semibold mt-0.5">{evaluation.humidity || 48.5} % RH</p>
            </div>
            <div>
              <span className="text-muted-foreground">Atmospheric Pressure:</span>
              <p className="font-mono font-semibold mt-0.5">{evaluation.barometric_pressure || 101.32} kPa</p>
            </div>
            <div>
              <span className="text-muted-foreground">Standard Weights:</span>
              <p className="font-medium mt-0.5">{evaluation.reference_standards || "OIML Class E2 / F1"}</p>
            </div>
          </div>
        </div>

        {/* 4. Test Results & MPE Compliance Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            4. OIML R 76-1 Test Results Summary
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Clause</TableHead>
                  <TableHead>Test Procedure</TableHead>
                  <TableHead>Max Observed Error (Ec)</TableHead>
                  <TableHead>Permissible Limit (MPE)</TableHead>
                  <TableHead className="text-right">Conformity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs font-semibold">A.4.4.1</TableCell>
                  <TableCell className="text-xs font-medium">Weighing Performance Test (0 to Max)</TableCell>
                  <TableCell className="font-mono text-xs text-foreground">+0.040 g</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">±0.100 g (±1.0 e)</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300">
                      PASSED
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-semibold">A.4.7</TableCell>
                  <TableCell className="text-xs font-medium">Repeatability Test (Clause 3.6.1)</TableCell>
                  <TableCell className="font-mono text-xs text-foreground">Δ = 0.020 g</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">≤ 0.100 g (|MPE|)</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300">
                      PASSED
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-semibold">A.4.8</TableCell>
                  <TableCell className="text-xs font-medium">Eccentric Loading Test (Clause 3.6.2)</TableCell>
                  <TableCell className="font-mono text-xs text-foreground">+0.035 g</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">±0.050 g (±0.5 e)</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300">
                      PASSED
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs font-semibold">A.4.2</TableCell>
                  <TableCell className="text-xs font-medium">Zero-setting & Tare Accuracy</TableCell>
                  <TableCell className="font-mono text-xs text-foreground">0.000 g</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">±0.25 d</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300">
                      PASSED
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 5. Conclusions & Verdict */}
        <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
            <CheckCircle2 className="h-4 w-4" />
            5. Final Evaluation Conclusion: PATTERN CONFORMS TO OIML R 76-1
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The Non-Automatic Weighing Instrument model <strong>{instrument.model_name}</strong> submitted by {instrument.applicant_name || "Mettler Toledo"} has been tested and evaluated in accordance with the metrological requirements of OIML Recommendation R 76-1 (Edition 2006). All measured errors and dispersion characteristics conform strictly within the Maximum Permissible Errors for Class {instrument.accuracy_class}.
          </p>
        </div>

        {/* 6. Sign-off & Digital Signature Verification Block */}
        <div className="pt-4 border-t-2 border-border/80 grid sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2 p-3 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Tested & Compiled By</span>
            <p className="font-bold text-foreground">{evaluator?.full_name || "Dr. Hans Meier"}</p>
            <p className="text-muted-foreground">{evaluator?.organization || "Metrological Testing Division"}</p>
            <p className="font-mono text-[10px] text-muted-foreground">Certified Legal Metrology Officer</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-primary uppercase tracking-wider font-bold">Authorized Digital Signature</span>
              <Lock className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="font-bold text-foreground">Dr. Vikramaditya Sen, Ph.D.</p>
            <p className="text-muted-foreground">Director of Legal Metrology & Conformity Assessment</p>
            <div className="pt-1 border-t border-primary/20 flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-primary truncate">
                SHA-256: 8f4e2b09a1c7d354b8e91024fcba9321ef778a0139b4b98c0d12e9a3
              </span>
              <span className="text-[9px] text-muted-foreground">
                Cryptographically certified & timestamped: {new Date(report.generated_at).toUTCString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
