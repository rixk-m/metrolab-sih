"use client";

import Link from "next/link";
import { Plus, Search, Filter, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoInstruments, demoManufacturers } from "@/lib/demo-data";
import { useState } from "react";
import type { InstrumentStatus } from "@/types";

function InstrumentStatusBadge({ status }: { status: InstrumentStatus }) {
  const config: Record<InstrumentStatus, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    under_evaluation: { label: "Under Evaluation", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
    archived: { label: "Archived", className: "bg-muted text-muted-foreground" },
  };
  const c = config[status] || config.active;
  return <Badge variant="outline" className={`text-xs font-medium ${c.className}`}>{c.label}</Badge>;
}

export default function InstrumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInstruments = demoInstruments.filter((ins) => {
    const matchesSearch = searchQuery === "" ||
      ins.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.instrument_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ins.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Instruments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage registered weighing instruments
          </p>
        </div>
        <Button asChild>
          <Link href="/instruments/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Instrument
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by model, serial number, type..."
            className="pl-9 bg-background shadow-sm hover:border-primary/30 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-background shadow-sm hover:border-primary/30 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="under_evaluation">Under Evaluation</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Instruments Table */}
      <Card className="overflow-hidden shadow-sm border-border/60 transition-shadow hover:shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Instrument</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Manufacturer</TableHead>
                <TableHead className="font-semibold">Serial Number</TableHead>
                <TableHead className="font-semibold">Class</TableHead>
                <TableHead className="font-semibold">Capacity</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstruments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-primary/5 p-4 rounded-full">
                        <Scale className="h-8 w-8 text-primary/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No instruments found</p>
                      <Button variant="outline" size="sm" asChild className="mt-2 shadow-sm hover:shadow-md transition-shadow">
                        <Link href="/instruments/new">Register Instrument</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInstruments.map((instrument) => {
                  const manufacturer = demoManufacturers.find(m => m.id === instrument.manufacturer_id);
                  return (
                    <TableRow key={instrument.id} className="group hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <Link
                          href={`/instruments/${instrument.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {instrument.model_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {instrument.instrument_type}
                      </TableCell>
                      <TableCell className="text-sm">
                        {manufacturer?.name || "—"}
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                        {instrument.serial_number}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-mono shadow-sm">
                          Class {instrument.accuracy_class}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {instrument.max_capacity.toLocaleString()} {instrument.unit}
                      </TableCell>
                      <TableCell>
                        <InstrumentStatusBadge status={instrument.status} />
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
