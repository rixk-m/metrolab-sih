"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Search, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { demoReports, demoEvaluations, demoInstruments } from "@/lib/demo-data";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = demoReports.filter((r) => {
    const evaluation = demoEvaluations.find(e => e.id === r.evaluation_id);
    const instrument = evaluation ? demoInstruments.find(i => i.id === evaluation.instrument_id) : null;
    const q = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      r.report_number.toLowerCase().includes(q) ||
      (evaluation?.evaluation_number.toLowerCase().includes(q) ?? false) ||
      (instrument?.model_name.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generated OIML R 76-1 evaluation reports and pattern approval documentation
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by report number, evaluation, model..."
            className="pl-9 bg-background shadow-sm hover:border-primary/30 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm border-border/60 transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Report Number</TableHead>
                <TableHead className="font-semibold">Evaluation Ref</TableHead>
                <TableHead className="font-semibold">Instrument Model</TableHead>
                <TableHead className="font-semibold">Version</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Issued</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-primary/5 p-4 rounded-full">
                        <FileText className="h-8 w-8 text-primary/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No reports matching search</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => {
                  const evaluation = demoEvaluations.find(e => e.id === report.evaluation_id);
                  const instrument = evaluation ? demoInstruments.find(i => i.id === evaluation.instrument_id) : null;
                  return (
                    <TableRow key={report.id} className="group hover:bg-muted/40 transition-colors">
                      <TableCell className="font-mono font-medium">
                        <Link
                          href={`/reports/${report.id}`}
                          className="text-primary hover:underline transition-colors"
                        >
                          {report.report_number}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono group-hover:text-foreground transition-colors">
                        {evaluation ? (
                          <Link href={`/evaluations/${evaluation.id}`} className="hover:underline">
                            {evaluation.evaluation_number}
                          </Link>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {instrument?.model_name || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs shadow-sm">v{report.version}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-sm">
                          {report.status === "approved" ? "Approved" : report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground tabular-nums">
                        {new Date(report.generated_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" asChild className="opacity-70 group-hover:opacity-100 transition-opacity">
                          <Link href={`/reports/${report.id}`} className="gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            View Certificate
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
