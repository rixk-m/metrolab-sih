"use client";

import { Users as UsersIcon, Shield, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { demoUsers } from "@/lib/demo-data";
import type { UserRole } from "@/types";

const roleBadge: Record<UserRole, { label: string; className: string }> = {
  administrator: { label: "Administrator", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  evaluator: { label: "Evaluator", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  reviewer: { label: "Reviewer", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  approving_officer: { label: "Approving Officer", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  viewer: { label: "Viewer", className: "bg-muted text-muted-foreground" },
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user accounts and role assignments</p>
        </div>
        <Button>
          <UsersIcon className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoUsers.map((user) => {
                const initials = user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                const role = roleBadge[user.role];
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{user.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs font-medium ${role.className}`}>{role.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.organization || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground tabular-nums">
                      {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
