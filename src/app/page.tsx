import { ThemeToggleLanding } from "./theme-toggle-landing";
import { LandingScene } from "@/components/landing/LandingScene";
import { LandingWrapper } from "@/components/LandingWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, User as UserIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profileName = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
    if (profile) profileName = profile.full_name;
  }

  return (
    <LandingWrapper>
      <div className="min-h-screen relative">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                  M
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  metro<span className="text-primary font-bold">LAB</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm">
                <a href="#platform" className="text-muted-foreground hover:text-foreground transition-colors">Platform</a>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#workflow" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggleLanding />
                
                {user ? (
                  <>
                    <div className="hidden sm:flex items-center gap-2 mr-2 text-sm text-muted-foreground border-r pr-4 border-border/40">
                      <UserIcon className="h-4 w-4" />
                      <span>{profileName || user.email}</span>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard">
                        Enter Dashboard
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/login">
                        Start Evaluation
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </>
                )}
                
              </div>
            </div>
          </div>
        </nav>

        {/* 3D Scroll Story */}
        <main className="w-full h-full">
          <LandingScene />
        </main>
      </div>
    </LandingWrapper>
  );
}
