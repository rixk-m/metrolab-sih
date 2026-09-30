"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Plus, CheckCircle2, FileText, Calendar, Building2, Cpu, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { demoInstruments, demoManufacturers, demoEvaluations } from "@/lib/demo-data";

export default function InstrumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const instrument = demoInstruments.find((i) => i.id === resolvedParams.id) || demoInstruments[0];
  const manufacturer = demoManufacturers.find((m) => m.id === instrument.manufacturer_id);
  const relatedEvaluations = demoEvaluations.filter((e) => e.instrument_id === instrument.id);

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/instruments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">{instrument.model_name}</h1>
              <Badge variant="outline" className="font-mono text-xs uppercase bg-primary/10 text-primary border-primary/20">
                Class {instrument.accuracy_class}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                {instrument.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Serial Number: <span className="font-mono">{instrument.serial_number}</span> · Manufacturer: {manufacturer?.name || "Independent"}
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href={`/evaluations/new?instrumentId=${instrument.id}`}>
            <Plus className="h-4 w-4 mr-2" />
            Initiate Evaluation
          </Link>
        </Button>
      </div>

      {/* Grid: Metrological Specs & Technical Info */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Metrological Limits Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              OIML R 76 Metrological Parameters
            </CardTitle>
            <CardDescription>
              Verified characteristics per OIML Recommendation R 76-1 (2006)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-border border-t border-border">
              <div className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Accuracy Class</span>
                <p className="text-lg font-bold font-mono text-foreground">Class {instrument.accuracy_class}</p>
                <span className="text-[10px] text-muted-foreground">
                  {instrument.accuracy_class === "I" ? "Special Accuracy" :
                   instrument.accuracy_class === "II" ? "High Accuracy" :
                   instrument.accuracy_class === "III" ? "Medium Accuracy" : "Ordinary"}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Maximum Capacity (Max)</span>
                <p className="text-lg font-bold font-mono text-foreground">
                  {instrument.max_capacity} <span className="text-sm font-normal text-muted-foreground">{instrument.unit}</span>
                </p>
                <span className="text-[10px] text-muted-foreground">Upper weighing limit</span>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Minimum Capacity (Min)</span>
                <p className="text-lg font-bold font-mono text-foreground">
                  {instrument.min_capacity} <span className="text-sm font-normal text-muted-foreground">{instrument.unit}</span>
                </p>
                <span className="text-[10px] text-muted-foreground">Lower limit of MPE validity</span>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Verification Interval (e)</span>
                <p className="text-lg font-bold font-mono text-foreground">
                  {instrument.verification_scale_interval || instrument.scale_interval} <span className="text-sm font-normal text-muted-foreground">{instrument.unit}</span>
                </p>
                <span className="text-[10px] text-muted-foreground">For pattern evaluation</span>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Actual Scale Interval (d)</span>
                <p className="text-lg font-bold font-mono text-foreground">
                  {instrument.scale_interval} <span className="text-sm font-normal text-muted-foreground">{instrument.unit}</span>
                </p>
                <span className="text-[10px] text-muted-foreground">Physical display resolution</span>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground">Intervals Count (n)</span>
                <p className="text-lg font-bold font-mono text-foreground">
                  {(instrument.num_intervals || Math.round(instrument.max_capacity / (instrument.verification_scale_interval || instrument.scale_interval))).toLocaleString()} e
                </p>
                <span className="text-[10px] text-muted-foreground">Resolution factor</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical & Hardware Specs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              Technical Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs">
            <div>
              <span className="text-muted-foreground">Instrument Type</span>
              <p className="font-medium mt-0.5">{instrument.instrument_type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tare Range</span>
              <p className="font-medium mt-0.5">{instrument.description || "Subtractive tare up to 100% Max"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Firmware / Software Version</span>
              <p className="font-mono font-medium mt-0.5">{instrument.software_version || "v2.4.1 (Legally relevant)"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Power Supply</span>
              <p className="font-medium mt-0.5">{instrument.power_supply || "230 V AC / 50 Hz"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Applicant / Submitter</span>
              <p className="font-medium mt-0.5">{instrument.applicant_name || "Mettler Toledo Metrology Division"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluations Conducted on this Instrument */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Evaluation History
            </CardTitle>
            <CardDescription>
              Type evaluations and compliance audits conducted for this pattern
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/evaluations/new?instrumentId=${instrument.id}`}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Evaluation
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evaluation Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Standard</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Initiated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatedEvaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-28 text-center text-sm text-muted-foreground">
                    No evaluations recorded for this instrument yet.
                  </TableCell>
                </TableRow>
              ) : (
                relatedEvaluations.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell>
                      <Link
                        href={`/evaluations/${ev.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {ev.evaluation_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{ev.evaluation_type}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      OIML R 76-1:2006
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {ev.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                      {new Date(ev.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
