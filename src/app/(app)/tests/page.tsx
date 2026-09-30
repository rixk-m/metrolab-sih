"use client";

import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoTestDefinitions, demoTestCategories } from "@/lib/demo-data";

export default function TestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Test Definitions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configured test procedures for NAWI evaluation
        </p>
      </div>

      {demoTestCategories.map((category) => {
        const tests = demoTestDefinitions.filter(t => t.category_id === category.id);
        return (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                {category.name}
                <Badge variant="secondary" className="ml-auto text-xs">{tests.length} tests</Badge>
              </CardTitle>
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <Badge variant="outline" className="font-mono text-xs">{test.code}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{test.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {test.description}
                      </p>
                      {test.standard_reference && (
                        <p className="text-xs text-primary/70 mt-1 font-mono">
                          Ref: {test.standard_reference}
                        </p>
                      )}
                    </div>
                    <Badge variant={test.is_active ? "default" : "secondary"} className="text-xs shrink-0">
                      {test.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
