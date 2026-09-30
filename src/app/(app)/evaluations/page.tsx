"use client";

import Link from "next/link";
import { Plus, Search, Filter, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { demoEvaluations, demoInstruments, demoUsers } from "@/lib/demo-data";
import { useState } from "react";
import type { EvaluationStatus } from "@/types";

function EvalStatusBadge({ status }: { status: EvaluationStatus }) {
  const config: Record<EvaluationStatus, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
    in_progress: { label: "In Progress", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
    awaiting_review: { label: "Under Review", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
    changes_requested: { label: "Changes Requested", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800" },
    approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    signed: { label: "Signed", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    archived: { label: "Archived", className: "bg-muted text-muted-foreground" },
  };
  const c = config[status] || config.draft;
  return <Badge variant="outline" className={`text-xs font-medium ${c.className}`}>{c.label}</Badge>;
}

export default function EvaluationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = demoEvaluations.filter((ev) => {
    const instrument = demoInstruments.find(i => i.id === ev.instrument_id);
    const matchesSearch = searchQuery === "" ||
      ev.evaluation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instrument?.model_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage NAWI type evaluations and testing workflows
          </p>
        </div>
        <Button asChild>
          <Link href="/evaluations/new">
            <Plus className="h-4 w-4 mr-2" />
            New Evaluation
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search evaluations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="awaiting_review">Under Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evaluation</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FlaskConical className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No evaluations found</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/evaluations/new">Create Evaluation</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((evaluation) => {
                  const instrument = demoInstruments.find(i => i.id === evaluation.instrument_id);
                  const evaluator = demoUsers.find(u => u.id === evaluation.evaluator_id);
                  return (
                    <TableRow key={evaluation.id}>
                      <TableCell>
                        <Link
                          href={`/evaluations/${evaluation.id}`}
                          className="font-medium hover:underline"
                        >
                          {evaluation.evaluation_number}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {evaluation.evaluation_type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{instrument?.model_name || "—"}</span>
                        <div className="text-xs text-muted-foreground">
                          {instrument?.instrument_type}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {evaluation.evaluation_type}
                      </TableCell>
                      <TableCell className="text-sm">
                        {evaluator?.full_name || "—"}
                      </TableCell>
                      <TableCell>
                        <EvalStatusBadge status={evaluation.status} />
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                        {new Date(evaluation.updated_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
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
