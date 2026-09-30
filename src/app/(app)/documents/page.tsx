"use client";

import { useState } from "react";
import {
  FolderOpen, Upload, Search, FileText, Image as ImageIcon,
  FileCheck, Shield, Download, Eye, Plus, CheckCircle2, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface DocumentItem {
  id: string;
  title: string;
  category: "calibration" | "evidence" | "datasheet" | "standard";
  fileName: string;
  fileSize: string;
  fileType: string;
  evaluationRef?: string;
  instrumentRef?: string;
  uploadedBy: string;
  uploadedAt: string;
}

const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "ISO/IEC 17025 Reference Weights E2 Calibration Certificate",
    category: "calibration",
    fileName: "CERT_MASS_E2_2026.pdf",
    fileSize: "2.4 MB",
    fileType: "PDF",
    evaluationRef: "EV-2026-0001",
    instrumentRef: "XP-6002S Precision NAWI",
    uploadedBy: "Dr. Hans Meier",
    uploadedAt: "2026-03-12T10:15:00Z",
  },
  {
    id: "doc-2",
    title: "OIML R 76-1 Eccentricity Test Grid Photographic Evidence",
    category: "evidence",
    fileName: "ECCENTRICITY_CORNERS_IMG_0412.jpg",
    fileSize: "4.8 MB",
    fileType: "JPG",
    evaluationRef: "EV-2026-0001",
    instrumentRef: "XP-6002S Precision NAWI",
    uploadedBy: "Dr. Hans Meier",
    uploadedAt: "2026-03-14T14:22:00Z",
  },
  {
    id: "doc-3",
    title: "Avery Weigh-Tronix Industrial Platform Technical Datasheet",
    category: "datasheet",
    fileName: "AWT_BENCHSCALE_30K_SPEC_REV3.pdf",
    fileSize: "1.1 MB",
    fileType: "PDF",
    instrumentRef: "AWT-BenchScale 30K",
    uploadedBy: "Admin Metrology",
    uploadedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "doc-4",
    title: "WELMEC 7.2 Legally Relevant Software Checksum Verification",
    category: "evidence",
    fileName: "SOFTWARE_INTEGRITY_LOG_V241.txt",
    fileSize: "48 KB",
    fileType: "TXT",
    evaluationRef: "EV-2026-0002",
    instrumentRef: "Entris-II Micro",
    uploadedBy: "Frau Elena Weiss",
    uploadedAt: "2026-03-18T16:45:00Z",
  },
  {
    id: "doc-5",
    title: "OIML Recommendation R 76-1 (Edition 2006) Official Text",
    category: "standard",
    fileName: "OIML_R076-1_E06.pdf",
    fileSize: "8.6 MB",
    fileType: "PDF",
    uploadedBy: "System Archive",
    uploadedAt: "2026-01-10T00:00:00Z",
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(q) ||
      doc.fileName.toLowerCase().includes(q) ||
      (doc.instrumentRef?.toLowerCase().includes(q) ?? false) ||
      (doc.evaluationRef?.toLowerCase().includes(q) ?? false);
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSimulateUpload = () => {
    const title = prompt("Enter Document Title / Description:");
    if (!title) return;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title,
      category: "evidence",
      fileName: `${title.toUpperCase().replace(/\s+/g, "_")}.pdf`,
      fileSize: "1.8 MB",
      fileType: "PDF",
      evaluationRef: "EV-2026-0001",
      uploadedBy: "Active Evaluator",
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    toast.success("Document uploaded and linked to repository successfully!");
  };

  const categoryBadges: Record<DocumentItem["category"], { label: string; color: string }> = {
    calibration: { label: "Calibration Certificate", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200" },
    evidence: { label: "Test Evidence", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200" },
    datasheet: { label: "Technical Datasheet", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200" },
    standard: { label: "OIML Standard", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Repository & Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Secure metrological document archive, calibration certificates, and test evidence
          </p>
        </div>
        <Button onClick={handleSimulateUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents, certificates, instruments..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Items" },
            { id: "calibration", label: "Calibration" },
            { id: "evidence", label: "Test Evidence" },
            { id: "datasheet", label: "Datasheets" },
            { id: "standard", label: "Standards" },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant={categoryFilter === cat.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategoryFilter(cat.id)}
              className="text-xs shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Title & File</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Linked Entity</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No documents found matching criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => {
                  const badge = categoryBadges[doc.category];
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded bg-muted text-primary shrink-0 mt-0.5">
                            {doc.fileType === "JPG" || doc.fileType === "PNG" ? (
                              <ImageIcon className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{doc.title}</p>
                            <p className="font-mono text-xs text-muted-foreground mt-0.5">
                              {doc.fileName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${badge.color}`}>
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {doc.instrumentRef && (
                          <p className="font-medium">{doc.instrumentRef}</p>
                        )}
                        {doc.evaluationRef && (
                          <span className="font-mono text-muted-foreground">{doc.evaluationRef}</span>
                        )}
                        {!doc.instrumentRef && !doc.evaluationRef && (
                          <span className="text-muted-foreground">General Standard</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {doc.fileSize}
                      </TableCell>
                      <TableCell className="text-xs">
                        <p className="font-medium">{doc.uploadedBy}</p>
                        <p className="text-muted-foreground text-[10px]">
                          {new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.info(`Viewing ${doc.fileName}`)}
                          className="h-8 gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
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
