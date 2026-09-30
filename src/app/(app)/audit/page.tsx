"use client";

import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAuditLogs, demoUsers } from "@/lib/demo-data";

const actionLabels: Record<string, string> = {
  "instrument.created": "Created instrument",
  "evaluation.created": "Created evaluation",
  "evaluation.started": "Started evaluation",
  "observation.recorded": "Recorded observation",
  "test.completed": "Completed test",
  "evaluation.submitted": "Submitted for review",
  "evaluation.reviewed": "Reviewed evaluation",
  "evaluation.approved": "Approved evaluation",
  "report.generated": "Generated report",
  "user.created": "Created user account",
};

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete audit trail of important system actions
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {demoAuditLogs.map((log, i) => {
              const user = demoUsers.find(u => u.id === log.user_id);
              return (
                <div key={log.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    {i < demoAuditLogs.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{user?.full_name || "System"}</span>
                      <span className="text-sm text-muted-foreground">
                        {actionLabels[log.action] || log.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-xs">{log.entity_type}</Badge>
                      <span className="text-xs text-muted-foreground font-mono">{log.entity_id}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium", timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
