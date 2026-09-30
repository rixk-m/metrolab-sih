"use client";

import { Settings as SettingsIcon, Building2, Shield, Palette, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoLaboratory, demoRuleset } from "@/lib/demo-data";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          System configuration and laboratory settings
        </p>
      </div>

      <Tabs defaultValue="laboratory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
          <TabsTrigger value="rulesets">Rulesets</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="laboratory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Laboratory Information
              </CardTitle>
              <CardDescription>Configure laboratory identification and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lab-name">Laboratory Name</Label>
                  <Input id="lab-name" defaultValue={demoLaboratory.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-accreditation">Accreditation Number</Label>
                  <Input id="lab-accreditation" defaultValue={demoLaboratory.accreditation_number || ""} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="lab-address">Address</Label>
                  <Input id="lab-address" defaultValue={demoLaboratory.address} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-contact">Contact Person</Label>
                  <Input id="lab-contact" defaultValue={demoLaboratory.contact_person || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lab-email">Contact Email</Label>
                  <Input id="lab-email" type="email" defaultValue={demoLaboratory.contact_email || ""} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rulesets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Active Ruleset
              </CardTitle>
              <CardDescription>Currently configured compliance ruleset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{demoRuleset.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">v{demoRuleset.version}</span>
                </div>
                <p className="text-sm text-muted-foreground">{demoRuleset.description}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Standard: {demoRuleset.standard}</span>
                  <span>Effective: {demoRuleset.effective_date}</span>
                  <span>Status: {demoRuleset.is_active ? "Active" : "Inactive"}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Ruleset requirements are marked as UNVERIFIED until validated against the applicable official standard document.
                No fabricated regulatory claims are made.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Demo Mode</p>
                  <p className="text-xs text-muted-foreground">Use demonstration data instead of live database</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Autosave</p>
                  <p className="text-xs text-muted-foreground">Automatically save evaluation drafts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Audit Logging</p>
                  <p className="text-xs text-muted-foreground">Record important system actions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
