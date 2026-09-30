"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, ShieldCheck, ArrowRight, CheckCircle2, UserCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/utils/supabase/client";
import { ThemeToggleLanding } from "@/app/theme-toggle-landing";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("evaluator");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const supabase = createClient();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMsg("Please enter your full name.");
          setIsLoading(false);
          return;
        }
        // Registration Flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: selectedRole,
            }
          }
        });
        if (error) throw error;
        
        // Log them out immediately because admin approval is required
        await supabase.auth.signOut();
        
        setSuccessMsg("Registration successful! Your account is pending Administrator approval. You cannot log in yet.");
        setIsSignUp(false);
      } else {
        // Login Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Check if user is approved
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_approved")
          .eq("id", data.user.id)
          .single();
          
        if (profile && profile.is_approved !== true) {
          // Block entry and sign out immediately
          await supabase.auth.signOut();
          setErrorMsg("Your account is still pending Administrator approval. You cannot log in yet.");
          setIsLoading(false);
          return;
        }
        
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const roleDescriptions: Record<UserRole, { title: string; desc: string; badge: string }> = {
    evaluator: {
      title: "Evaluator / Test Engineer",
      desc: "Record metrological observations, execute OIML R 76 test suites, and compile findings.",
      badge: "Testing & Observations",
    },
    reviewer: {
      title: "Technical Reviewer",
      desc: "Audit test data, verify calculations, add remarks, and approve or request test corrections.",
      badge: "Audit & Verification",
    },
    approving_officer: {
      title: "Approving Officer / Director",
      desc: "Final authorization, cryptographic digital signature, and issuance of Type Approval certificates.",
      badge: "Digital Signature & Issuance",
    },
    administrator: {
      title: "System Administrator",
      desc: "Manage laboratory staff, test definitions, audit trails, and global system parameters.",
      badge: "Full System Access",
    },
    viewer: {
      title: "Authorized Observer / Viewer",
      desc: "Read-only access to completed evaluations, certificates, and historical archive.",
      badge: "Read-only Inspection",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            <Scale className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">metro<span className="text-primary">LAB</span></span>
          <span className="text-xs text-muted-foreground hidden sm:inline-block border-l border-border/60 pl-2 ml-1">
            OIML R 76 Platform
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggleLanding />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center">
          {/* Left Info Panel */}
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Role-Based Access Control (RBAC)
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Laboratory Access Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Sign in with your metrology credentials or use a designated prototype persona to experience the complete NAWI type-evaluation lifecycle.
              </p>
            </div>

            {/* Persona Quick Selection */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Persona for Evaluation
              </p>
              {(Object.keys(roleDescriptions) as UserRole[]).map((role) => {
                const info = roleDescriptions[role];
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-sm"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center border shrink-0 ${
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                    }`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold">{info.title}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                          {info.badge}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {info.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Login Card */}
          <div className="md:col-span-7">
            <Card className="shadow-lg border-border/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Authentication</CardTitle>
                <CardDescription>
                  Active Role: <span className="font-semibold text-foreground capitalize">{selectedRole.replace("_", " ")}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                    {successMsg}
                  </div>
                )}
                <form onSubmit={handleAuth} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Jane Smith"
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Laboratory Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@metrolab.org"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-foreground">
                        Authorization Key / Password
                      </label>
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-muted/60 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-1.5 font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        Target Role:
                      </div>
                      <span className="capitalize">{selectedRole.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? "Authenticating..." : isSignUp ? "Register Account" : "Enter metroLAB"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs text-muted-foreground"
                    >
                      {isSignUp ? "Already have an account? Sign In" : "Need to register? Sign Up"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="pt-0 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground py-3">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  256-bit TLS encrypted session
                </span>
                <span className="font-mono text-[10px]">OIML R 76-1:2006</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
