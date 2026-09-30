"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Check, FlaskConical, Scale, Thermometer,
  Layers, ClipboardCheck, Sparkles, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  demoInstruments, demoTestDefinitions, demoEvaluations, demoEvaluationTests
} from "@/lib/demo-data";
import { useAuth } from "@/lib/auth-context";
import type { Evaluation, EvaluationTest } from "@/types";
import { toast } from "sonner";

export default function NewEvaluationWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedInstrumentId = searchParams.get("instrumentId");
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [instrumentId, setInstrumentId] = useState(
    preselectedInstrumentId || demoInstruments[0]?.id || ""
  );
  const [evaluationType, setEvaluationType] = useState("Full Type Evaluation (OIML R 76-1)");
  const [standardReference, setStandardReference] = useState("OIML R 76-1:2006 (Non-Automatic Weighing Instruments)");
  const [temperature, setTemperature] = useState<number>(20.8);
  const [humidity, setHumidity] = useState<number>(48.5);
  const [pressure, setPressure] = useState<number>(101.32);
  const [weightClass, setWeightClass] = useState("OIML Class E2 (Stainless Steel)");
  const [selectedTests, setSelectedTests] = useState<string[]>([
    "d0000000-0000-0000-0000-000000000001", // Weighing performance
    "d0000000-0000-0000-0000-000000000002", // Repeatability
    "d0000000-0000-0000-0000-000000000003", // Eccentricity
    "d0000000-0000-0000-0000-000000000004", // Zero/tare
  ]);
  const [notes, setNotes] = useState("");

  const selectedInstrument = demoInstruments.find((i) => i.id === instrumentId);

  const toggleTest = (testId: string) => {
    setSelectedTests((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const handleCreateEvaluation = () => {
    const newId = `ev-${Date.now()}`;
    const nextNumber = `EV-2026-${String(demoEvaluations.length + 10).padStart(4, "0")}`;

    const newEvaluation: Evaluation = {
      id: newId,
      evaluation_number: nextNumber,
      instrument_id: instrumentId,
      instrument: selectedInstrument,
      laboratory_id: "lab-001",
      evaluator_id: user.id || "usr-002",
      evaluator: user,
      reviewer_id: "usr-003",
      approver_id: "usr-004",
      status: "in_progress",
      evaluation_type: evaluationType,
      temperature,
      humidity,
      barometric_pressure: pressure,
      environmental_notes: `Reference weights: ${weightClass}. Ambient stable.`,
      reference_standards: weightClass,
      applicable_ruleset_id: "ruleset-r76-2006",
      notes,
      started_at: new Date().toISOString(),
      submitted_at: null,
      reviewed_at: null,
      approved_at: null,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add evaluation tests
    selectedTests.forEach((testDefId) => {
      const def = demoTestDefinitions.find((t) => t.id === testDefId);
      const evalTest: EvaluationTest = {
        id: `et-${Date.now()}-${testDefId.slice(-4)}`,
        evaluation_id: newId,
        test_definition_id: testDefId,
        test_definition: def,
        status: "not_started",
        is_applicable: true,
        notes: null,
        started_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      demoEvaluationTests.push(evalTest);
    });

    demoEvaluations.unshift(newEvaluation);
    toast.success(`Evaluation ${nextNumber} initialized!`);
    router.push(`/evaluations/${newId}`);
  };

  const steps = [
    { num: 1, title: "Instrument Selection", icon: Scale },
    { num: 2, title: "Standard & Scope", icon: Layers },
    { num: 3, title: "Laboratory Environment", icon: Thermometer },
    { num: 4, title: "Test Suite Config", icon: ClipboardCheck },
  ];

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Top Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/evaluations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New Evaluation Setup Wizard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure NAWI pattern evaluation per OIML Recommendation R 76-1
          </p>
        </div>
      </div>

      {/* Stepper Bar */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                isActive
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/40 font-semibold"
                  : isDone
                  ? "border-border bg-muted/40 text-foreground cursor-pointer"
                  : "border-border/40 text-muted-foreground opacity-60"
              }`}
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                  isDone
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : s.num}
              </div>
              <span className="text-xs truncate hidden sm:inline">{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Instrument Selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              Step 1: Select Instrument Under Evaluation
            </CardTitle>
            <CardDescription>
              Choose a registered instrument from the laboratory inventory or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Instrument Model & Serial Number</label>
              <Select value={instrumentId} onValueChange={setInstrumentId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select instrument" />
                </SelectTrigger>
                <SelectContent>
                  {demoInstruments.map((ins) => (
                    <SelectItem key={ins.id} value={ins.id}>
                      {ins.model_name} (Class {ins.accuracy_class}, Max {ins.max_capacity} {ins.unit}) — SN: {ins.serial_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedInstrument && (
              <div className="p-4 rounded-lg bg-muted/60 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">{selectedInstrument.model_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedInstrument.instrument_type}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/20">
                    Class {selectedInstrument.accuracy_class}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-border">
                  <div>
                    <span className="text-muted-foreground">Max Capacity:</span>
                    <p className="font-mono font-semibold">{selectedInstrument.max_capacity} {selectedInstrument.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min Capacity:</span>
                    <p className="font-mono font-semibold">{selectedInstrument.min_capacity} {selectedInstrument.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interval (e):</span>
                    <p className="font-mono font-semibold">{selectedInstrument.verification_scale_interval || selectedInstrument.scale_interval} {selectedInstrument.unit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interval (d):</span>
                    <p className="font-mono font-semibold">{selectedInstrument.scale_interval} {selectedInstrument.unit}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
              <span>Need to evaluate a device not listed?</span>
              <Button variant="link" size="sm" asChild className="p-0 h-auto">
                <Link href="/instruments/new">Register a new instrument</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setStep(2)}>
              Next: Scope & Standard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Evaluation Scope & Standard */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Step 2: Evaluation Scope & Metrological Standard
            </CardTitle>
            <CardDescription>
              Define the evaluation type and applicable regulatory ruleset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Evaluation Type</label>
                <Select value={evaluationType} onValueChange={setEvaluationType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Evaluation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Type Evaluation (OIML R 76-1)">Full Pattern / Type Evaluation</SelectItem>
                    <SelectItem value="Initial Verification">Initial Verification (Clause 3.5.1)</SelectItem>
                    <SelectItem value="Design Modification Evaluation">Design Modification Evaluation</SelectItem>
                    <SelectItem value="Periodic Re-Verification">Periodic Re-Verification (Clause 3.5.2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Governing Metrological Standard</label>
                <Select value={standardReference} onValueChange={setStandardReference}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OIML R 76-1:2006 (Non-Automatic Weighing Instruments)">
                      OIML R 76-1:2006 (Standard International)
                    </SelectItem>
                    <SelectItem value="Legal Metrology (General) Rules, India (Schedule VI)">
                      Legal Metrology Rules 2011 (India Schedule VI)
                    </SelectItem>
                    <SelectItem value="WELMEC 7.2 Software Guide">
                      WELMEC 7.2 (Software Evaluation)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Deterministic OIML R 76 Rules Engine Enabled
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Evaluation limits, Maximum Permissible Errors (MPE), zero corrections ($E_c = E - E_0$), and repeatability thresholds are computed deterministically per Table 6 of OIML R 76-1.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next: Environmental Setup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: Environmental Conditions */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-primary" />
              Step 3: Laboratory Environmental Conditions
            </CardTitle>
            <CardDescription>
              Record ambient conditions required for valid metrological traceability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Ambient Temperature (°C)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                  required
                />
                <span className="text-[10px] text-muted-foreground">Standard range: 15.0 - 25.0 °C</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Relative Humidity (%)</label>
                <Input
                  type="number"
                  step="0.5"
                  value={humidity}
                  onChange={(e) => setHumidity(parseFloat(e.target.value) || 0)}
                  required
                />
                <span className="text-[10px] text-muted-foreground">Allowed range: 30 - 70 % RH</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Atmospheric Pressure (kPa)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={pressure}
                  onChange={(e) => setPressure(parseFloat(e.target.value) || 0)}
                  required
                />
                <span className="text-[10px] text-muted-foreground">Standard: 101.32 kPa</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Reference Standard Weights Accuracy Class</label>
              <Select value={weightClass} onValueChange={setWeightClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Weights Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OIML Class E1 (Ultra-precision standard)">OIML Class E1 (Ultra-precision balance testing)</SelectItem>
                  <SelectItem value="OIML Class E2 (Stainless Steel)">OIML Class E2 (High accuracy Class I & II balances)</SelectItem>
                  <SelectItem value="OIML Class F1 (Polished Stainless)">OIML Class F1 (Class II precision scales)</SelectItem>
                  <SelectItem value="OIML Class M1 (Cast Iron / Brass)">OIML Class M1 (Class III commercial & platform scales)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Environmental & Laboratory Observations</label>
              <Input
                placeholder="e.g. Test performed on anti-vibration granite table under Class 10,000 cleanroom condition."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)}>
              Next: Test Suite Selection
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 4: Test Suite Selection */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Step 4: Select Applicable Test Procedures
            </CardTitle>
            <CardDescription>
              Select which OIML R 76-1 test suites will be conducted in this evaluation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoTestDefinitions.map((test) => {
              const isChecked = selectedTests.includes(test.id);
              return (
                <div
                  key={test.id}
                  onClick={() => toggleTest(test.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/60 hover:bg-muted/40 opacity-70"
                  }`}
                >
                  <div
                    className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border shrink-0 ${
                      isChecked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">{test.name}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {test.code}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {test.description}
                    </p>
                    <span className="text-[10px] text-primary/70 font-mono mt-1 inline-block">
                      Ref: {test.standard_reference}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button
              onClick={handleCreateEvaluation}
              disabled={selectedTests.length === 0}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Initialize Evaluation ({selectedTests.length} Tests)
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
