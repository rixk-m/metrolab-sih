"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Plus, Trash2, CheckCircle2, XCircle, AlertTriangle,
  FlaskConical, RefreshCw, BarChart2, ShieldCheck, ArrowRight, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  demoEvaluations, demoInstruments, demoEvaluationTests, demoTestDefinitions,
  demoObservations
} from "@/lib/demo-data";
import { calculateMPE } from "@/lib/calculations/engine";
import { toast } from "sonner";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine
} from "recharts";

interface ObservationRow {
  id: string;
  loadPoint: number; // L (g)
  indication: number; // I (g)
  deltaL: number; // additional weight to next transition (g)
  direction: "increasing" | "decreasing";
}

export default function TestExecutionWorkspacePage({
  params,
}: {
  params: Promise<{ id: string; testId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const evaluation = demoEvaluations.find((e) => e.id === resolvedParams.id) || demoEvaluations[0];
  const instrument = demoInstruments.find((i) => i.id === evaluation.instrument_id) || demoInstruments[0];
  const evalTest = demoEvaluationTests.find((t) => t.id === resolvedParams.testId) || demoEvaluationTests[0];
  const testDef = demoTestDefinitions.find((d) => d.id === evalTest.test_definition_id) || demoTestDefinitions[0];

  const scaleIntervalE = instrument.verification_scale_interval || instrument.scale_interval || 1;
  const scaleIntervalD = instrument.scale_interval || 0.1;
  const accuracyClass = instrument.accuracy_class || "III";

  // Initial observations from existing demo data or standard defaults
  const [rows, setRows] = useState<ObservationRow[]>(() => {
    // Generate standard OIML R 76 test load points
    const e = scaleIntervalE;
    const max = instrument.max_capacity;
    const min = instrument.min_capacity;

    return [
      { id: "row-0", loadPoint: 0, indication: 0, deltaL: 0.5 * scaleIntervalD, direction: "increasing" },
      { id: "row-1", loadPoint: min, indication: min, deltaL: 0.5 * scaleIntervalD, direction: "increasing" },
      { id: "row-2", loadPoint: 500 * e, indication: 500 * e, deltaL: 0.45 * scaleIntervalD, direction: "increasing" },
      { id: "row-3", loadPoint: 1000 * e, indication: 1000 * e + scaleIntervalD, deltaL: 0.6 * scaleIntervalD, direction: "increasing" },
      { id: "row-4", loadPoint: 2000 * e, indication: 2000 * e, deltaL: 0.4 * scaleIntervalD, direction: "increasing" },
      { id: "row-5", loadPoint: max * 0.75, indication: max * 0.75, deltaL: 0.5 * scaleIntervalD, direction: "increasing" },
      { id: "row-6", loadPoint: max, indication: max, deltaL: 0.52 * scaleIntervalD, direction: "increasing" },
      { id: "row-7", loadPoint: max * 0.75, indication: max * 0.75, deltaL: 0.48 * scaleIntervalD, direction: "decreasing" },
      { id: "row-8", loadPoint: 1000 * e, indication: 1000 * e, deltaL: 0.5 * scaleIntervalD, direction: "decreasing" },
      { id: "row-9", loadPoint: min, indication: min, deltaL: 0.5 * scaleIntervalD, direction: "decreasing" },
      { id: "row-10", loadPoint: 0, indication: 0, deltaL: 0.5 * scaleIntervalD, direction: "decreasing" },
    ];
  });

  // Calculate Zero Error E0 from the zero load observation (row at loadPoint === 0)
  const zeroRow = rows.find((r) => r.loadPoint === 0) || rows[0];
  const zeroP = (zeroRow?.indication || 0) + 0.5 * scaleIntervalD - (zeroRow?.deltaL || 0);
  const zeroErrorE0 = zeroP - (zeroRow?.loadPoint || 0);

  // Compute calculated values for each observation row
  const computedRows = useMemo(() => {
    return rows.map((row, idx) => {
      // P = I + 0.5d - delta_L
      const calculatedP = row.indication + 0.5 * scaleIntervalD - row.deltaL;
      // Error E = P - L
      const errorE = calculatedP - row.loadPoint;
      // Corrected error Ec = E - E0
      const correctedErrorEc = errorE - zeroErrorE0;

      // OIML R 76 MPE for this load
      const mpeLimit = calculateMPE(row.loadPoint, scaleIntervalE, accuracyClass) ?? (scaleIntervalE * 1.0);
      const isCompliant = Math.abs(correctedErrorEc) <= mpeLimit + 0.00001;

      return {
        ...row,
        index: idx + 1,
        calculatedP: parseFloat(calculatedP.toFixed(4)),
        errorE: parseFloat(errorE.toFixed(4)),
        correctedErrorEc: parseFloat(correctedErrorEc.toFixed(4)),
        mpeLimit: parseFloat(mpeLimit.toFixed(4)),
        isCompliant,
        ratio: mpeLimit > 0 ? parseFloat((Math.abs(correctedErrorEc) / mpeLimit).toFixed(2)) : 0,
      };
    });
  }, [rows, scaleIntervalD, scaleIntervalE, accuracyClass, zeroErrorE0]);

  // Overall Test Verdict
  const hasFailures = computedRows.some((r) => !r.isCompliant);
  const maxObservedError = Math.max(...computedRows.map((r) => Math.abs(r.correctedErrorEc)));
  const worstCaseRatio = Math.max(...computedRows.map((r) => r.ratio));

  // Chart dataset
  const chartData = useMemo(() => {
    // Sort by loadPoint for increasing, and keep separate for decreasing
    return computedRows.map((r) => ({
      name: `${r.loadPoint}g (${r.direction[0].toUpperCase()})`,
      load: r.loadPoint,
      error: r.correctedErrorEc,
      upperMpe: r.mpeLimit,
      lowerMpe: -r.mpeLimit,
      direction: r.direction,
    }));
  }, [computedRows]);

  const updateRow = (id: string, field: keyof ObservationRow, value: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const addRow = () => {
    const newId = `row-${Date.now()}`;
    const lastLoad = rows.length > 0 ? rows[rows.length - 1].loadPoint : 0;
    setRows((prev) => [
      ...prev,
      {
        id: newId,
        loadPoint: lastLoad + 500,
        indication: lastLoad + 500,
        deltaL: 0.5 * scaleIntervalD,
        direction: "increasing",
      },
    ]);
  };

  const deleteRow = (id: string) => {
    if (rows.length <= 1) {
      toast.error("At least one observation point is required.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveAndComplete = () => {
    evalTest.status = "completed";
    toast.success("Observations verified and test marked as COMPLETED!");
    router.push(`/evaluations/${evaluation.id}`);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/evaluations/${evaluation.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">{testDef.name}</h1>
              <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/20">
                Clause {testDef.code}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  hasFailures
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300"
                }`}
              >
                {hasFailures ? "NON-COMPLIANT" : "WITHIN MPE (PASS)"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Evaluation: <span className="font-mono text-foreground">{evaluation.evaluation_number}</span> · Instrument: {instrument.model_name} (Class {accuracyClass}, e={scaleIntervalE}{instrument.unit}, d={scaleIntervalD}{instrument.unit})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.success("Draft observations autosaved.")}>
            <Save className="h-4 w-4 mr-1.5" />
            Save Draft
          </Button>
          <Button onClick={handleSaveAndComplete} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Complete Test Suite
          </Button>
        </div>
      </div>

      {/* KPI Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Governing Standard</span>
          <p className="text-base font-semibold font-mono mt-1 text-foreground">
            OIML R 76 Table 6
          </p>
          <span className="text-[10px] text-muted-foreground">Initial Verification</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Max Observed Error (Ec)</span>
          <p className="text-xl font-bold font-mono mt-1 text-foreground">
            {maxObservedError.toFixed(3)} <span className="text-xs font-normal text-muted-foreground">{instrument.unit}</span>
          </p>
          <span className="text-[10px] text-muted-foreground">Zero-corrected</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Worst-Case MPE Ratio</span>
          <p className={`text-xl font-bold font-mono mt-1 ${worstCaseRatio > 1.0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
            {(worstCaseRatio * 100).toFixed(0)}% <span className="text-xs font-normal text-muted-foreground">of limit</span>
          </p>
          <span className="text-[10px] text-muted-foreground">Threshold: ≤ 100%</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs text-muted-foreground">Test Suite Status</span>
          <div className="flex items-center gap-2 mt-1">
            {hasFailures ? (
              <div className="flex items-center gap-1.5 text-sm font-bold text-destructive">
                <XCircle className="h-4 w-4" />
                Exceeds MPE
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Compliant (PASS)
              </div>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">{rows.length} observation points</span>
        </Card>
      </div>

      {/* Recharts Error Curve Visualization */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              OIML R 76 Error Curve & Tolerance Envelope
            </CardTitle>
            <CardDescription>
              Plot of Zero-Corrected Error ($E_c$) against Maximum Permissible Error (MPE) envelope
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="load" unit={` ${instrument.unit}`} />
                <YAxis unit={` ${instrument.unit}`} />
                <Tooltip
                  formatter={(val: any) => [`${val} ${instrument.unit}`, ""]}
                  labelFormatter={(lbl: any) => `Load: ${lbl} ${instrument.unit}`}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" label="Zero" />
                {/* Upper MPE Boundary */}
                <Line
                  type="stepAfter"
                  dataKey="upperMpe"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  name="+MPE Tolerance Limit"
                  dot={false}
                />
                {/* Lower MPE Boundary */}
                <Line
                  type="stepAfter"
                  dataKey="lowerMpe"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  name="-MPE Tolerance Limit"
                  dot={false}
                />
                {/* Corrected Error Curve */}
                <Line
                  type="monotone"
                  dataKey="error"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  name="Observed Corrected Error (Ec)"
                  dot={{ r: 4, fill: "#0f766e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Observation Table with Real-time Calculations */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              Metrological Observations & Calculations Sheet
            </CardTitle>
            <CardDescription>
              Formula: True Indication $P = I + 0.5d - \Delta L$, Error $E = P - L$, Corrected $E_c = E - E_0$
            </CardDescription>
          </div>
          <Button size="sm" onClick={addRow} variant="outline" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Test Point
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="w-28">Direction</TableHead>
                <TableHead className="w-32">Load L ({instrument.unit})</TableHead>
                <TableHead className="w-32">Indication I ({instrument.unit})</TableHead>
                <TableHead className="w-28">ΔL ({instrument.unit})</TableHead>
                <TableHead className="text-right">Calc. P ({instrument.unit})</TableHead>
                <TableHead className="text-right">Error E ({instrument.unit})</TableHead>
                <TableHead className="text-right font-bold">Ec ({instrument.unit})</TableHead>
                <TableHead className="text-right font-mono">MPE (±)</TableHead>
                <TableHead className="text-center">Verdict</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {computedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {row.index}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() =>
                        updateRow(
                          row.id,
                          "direction",
                          row.direction === "increasing" ? "decreasing" : "increasing"
                        )
                      }
                      className="cursor-pointer text-[11px] font-mono capitalize px-2 py-0.5 rounded bg-muted hover:bg-muted/80"
                    >
                      {row.direction}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="any"
                      className="h-8 font-mono text-xs"
                      value={row.loadPoint}
                      onChange={(e) => updateRow(row.id, "loadPoint", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="any"
                      className="h-8 font-mono text-xs"
                      value={row.indication}
                      onChange={(e) => updateRow(row.id, "indication", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="any"
                      className="h-8 font-mono text-xs"
                      value={row.deltaL}
                      onChange={(e) => updateRow(row.id, "deltaL", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {row.calculatedP}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {row.errorE > 0 ? `+${row.errorE}` : row.errorE}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-semibold tabular-nums text-foreground">
                    {row.correctedErrorEc > 0 ? `+${row.correctedErrorEc}` : row.correctedErrorEc}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-primary tabular-nums">
                    ±{row.mpeLimit}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.isCompliant ? (
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300">
                        PASS
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30">
                        FAIL
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteRow(row.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
