"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, CheckCircle2, AlertTriangle, Scale, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { demoManufacturers, demoInstruments } from "@/lib/demo-data";
import type { AccuracyClass, Instrument } from "@/types";
import { toast } from "sonner";

export default function NewInstrumentPage() {
  const router = useRouter();

  // Form State
  const [modelName, setModelName] = useState("");
  const [manufacturerId, setManufacturerId] = useState(demoManufacturers[0]?.id || "");
  const [serialNumber, setSerialNumber] = useState("");
  const [instrumentType, setInstrumentType] = useState("Electronic Non-Automatic Weighing Instrument");
  const [accuracyClass, setAccuracyClass] = useState<AccuracyClass>("III");
  const [maxCapacity, setMaxCapacity] = useState<number>(15000);
  const [minCapacity, setMinCapacity] = useState<number>(100);
  const [verificationIntervalE, setVerificationIntervalE] = useState<number>(5);
  const [actualIntervalD, setActualIntervalD] = useState<number>(1);
  const [unit, setUnit] = useState("g");
  const [tareRange, setTareRange] = useState("0 - 15000 g");
  const [softwareVersion, setSoftwareVersion] = useState("v1.0.0");
  const [powerSupply, setPowerSupply] = useState("230 V AC, 50 Hz");
  const [description, setDescription] = useState("");

  // Metrological calculations
  const numIntervals = verificationIntervalE > 0 ? Math.round(maxCapacity / verificationIntervalE) : 0;

  // OIML R 76 compliance check for interval range n and min capacity
  const getValidationErrors = () => {
    const errors: string[] = [];
    if (!modelName.trim()) errors.push("Model name is required.");
    if (!serialNumber.trim()) errors.push("Serial number is required.");
    if (maxCapacity <= 0) errors.push("Max capacity must be greater than 0.");
    if (minCapacity <= 0 || minCapacity >= maxCapacity) errors.push("Min capacity must be > 0 and < Max capacity.");
    if (verificationIntervalE <= 0) errors.push("Verification scale interval (e) must be > 0.");
    if (actualIntervalD <= 0) errors.push("Actual scale interval (d) must be > 0.");
    if (actualIntervalD > verificationIntervalE) errors.push("Actual scale interval (d) cannot exceed verification interval (e).");

    // OIML Rules
    if (accuracyClass === "I") {
      if (numIntervals < 50000) errors.push("Class I requires at least 50,000 intervals (current n = " + numIntervals + ").");
      if (minCapacity < 100 * verificationIntervalE) errors.push(`Class I requires Min >= 100e (${100 * verificationIntervalE} ${unit}).`);
    } else if (accuracyClass === "II") {
      if (numIntervals < 100 || numIntervals > 100000) errors.push("Class II requires between 100 and 100,000 intervals.");
      if (minCapacity < 20 * verificationIntervalE) errors.push(`Class II requires Min >= 20e (${20 * verificationIntervalE} ${unit}).`);
    } else if (accuracyClass === "III") {
      if (numIntervals < 100 || numIntervals > 10000) errors.push("Class III requires between 100 and 10,000 intervals (current n = " + numIntervals + ").");
      if (minCapacity < 20 * verificationIntervalE) errors.push(`Class III requires Min >= 20e (${20 * verificationIntervalE} ${unit}).`);
    } else if (accuracyClass === "IIII") {
      if (numIntervals < 100 || numIntervals > 1000) errors.push("Class IIII requires between 100 and 1,000 intervals.");
      if (minCapacity < 10 * verificationIntervalE) errors.push(`Class IIII requires Min >= 10e (${10 * verificationIntervalE} ${unit}).`);
    }

    return errors;
  };

  const validationErrors = getValidationErrors();
  const isValid = validationErrors.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Please fix metrological specification errors before saving.");
      return;
    }

    const newId = `ins-${Date.now()}`;
    const newInstrument: Instrument = {
      id: newId,
      manufacturer_id: manufacturerId,
      model_name: modelName,
      instrument_type: instrumentType,
      serial_number: serialNumber,
      accuracy_class: accuracyClass,
      max_capacity: maxCapacity,
      min_capacity: minCapacity,
      scale_interval: actualIntervalD,
      verification_scale_interval: verificationIntervalE,
      unit,
      num_intervals: numIntervals,
      display_type: "Digital 7-segment LED",
      power_supply: powerSupply,
      software_version: softwareVersion,
      description,
      status: "active",
      applicant_name: "National Weighing Systems Ltd",
      applicant_address: "Industrial Metrology Zone, Area 4",
      created_by: "usr-001",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Prepend to in-memory demo instruments
    demoInstruments.unshift(newInstrument);
    toast.success(`Instrument ${modelName} registered successfully!`);
    router.push(`/instruments/${newId}`);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/instruments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Register New Instrument</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add a weighing instrument for OIML R 76 type evaluation and metrological testing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Manufacturer & General Identification */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              General Identification
            </CardTitle>
            <CardDescription>
              Basic identification, manufacturer, and model specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Manufacturer *</label>
                <Select value={manufacturerId} onValueChange={setManufacturerId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoManufacturers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({m.country || "Intl"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Model Designation *</label>
                <Input
                  placeholder="e.g. XP-6002S Precision NAWI"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Serial Number *</label>
                <Input
                  placeholder="e.g. SN-CH-2026-9041"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Instrument Type</label>
                <Input
                  value={instrumentType}
                  onChange={(e) => setInstrumentType(e.target.value)}
                  placeholder="e.g. Non-Automatic Weighing Instrument"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Metrological Characteristics (OIML R 76) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Metrological Characteristics (OIML R 76-1)</span>
              <Badge variant="outline" className="font-mono text-xs">
                Class {accuracyClass}
              </Badge>
            </CardTitle>
            <CardDescription>
              Accuracy class, capacity limits, and verification scale intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Accuracy Class *</label>
                <Select
                  value={accuracyClass}
                  onValueChange={(val) => setAccuracyClass(val as AccuracyClass)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Accuracy Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">Class I — Special Accuracy</SelectItem>
                    <SelectItem value="II">Class II — High Accuracy</SelectItem>
                    <SelectItem value="III">Class III — Medium Accuracy</SelectItem>
                    <SelectItem value="IIII">Class IIII — Ordinary Accuracy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Unit of Measurement</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="mg">Milligram (mg)</SelectItem>
                    <SelectItem value="t">Tonne (t)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Maximum Capacity (Max) *</label>
                <Input
                  type="number"
                  step="any"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Minimum Capacity (Min) *</label>
                <Input
                  type="number"
                  step="any"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">
                  Verification Scale Interval (e) *
                </label>
                <Input
                  type="number"
                  step="any"
                  value={verificationIntervalE}
                  onChange={(e) => setVerificationIntervalE(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">
                  Actual Scale Interval (d) *
                </label>
                <Input
                  type="number"
                  step="any"
                  value={actualIntervalD}
                  onChange={(e) => setActualIntervalD(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            {/* Calculated Interval Info Box */}
            <div className="p-4 rounded-lg bg-muted/60 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Verification Scale Intervals Count (n)
                </p>
                <p className="text-2xl font-bold font-mono tracking-tight mt-0.5">
                  n = {numIntervals.toLocaleString()} e
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Formula: n = Max / e = {maxCapacity} / {verificationIntervalE}
                </p>
              </div>
              <div className="text-right sm:border-l sm:border-border sm:pl-4">
                <p className="text-xs font-medium text-muted-foreground">Resolution Ratio</p>
                <p className="text-sm font-semibold font-mono">
                  e / d = {(verificationIntervalE / (actualIntervalD || 1)).toFixed(1)}
                </p>
              </div>
            </div>

            {/* Validation Feedback */}
            {validationErrors.length > 0 ? (
              <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  Metrological Rule Violations (OIML R 76-1):
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Metrological parameters conform to OIML R 76-1 Class {accuracyClass} limits.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Technical Parameters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Technical Specifications</CardTitle>
            <CardDescription>
              Tare capability, electronics, and firmware versions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Tare Range</label>
                <Input
                  value={tareRange}
                  onChange={(e) => setTareRange(e.target.value)}
                  placeholder="e.g. 0 - 15000 g"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Power Supply</label>
                <Input
                  value={powerSupply}
                  onChange={(e) => setPowerSupply(e.target.value)}
                  placeholder="e.g. 230 V AC / 50 Hz"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Firmware / Software Version</label>
                <Input
                  value={softwareVersion}
                  onChange={(e) => setSoftwareVersion(e.target.value)}
                  placeholder="e.g. v2.4.1"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Technical Description & Special Features</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Includes motorized internal calibration weights and level bubble sensor."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/instruments">Cancel</Link>
          </Button>
          <Button type="submit" disabled={!isValid} className="gap-2">
            <Save className="h-4 w-4" />
            Register Instrument
          </Button>
        </div>
      </form>
    </div>
  );
}
