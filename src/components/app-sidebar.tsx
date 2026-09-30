"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  FlaskConical,
  Scale,
  ClipboardCheck,
  FileText,
  Users,
  Settings,
  History,
  BarChart3,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Evaluations", href: "/evaluations", icon: FlaskConical, badge: "2" },
  { title: "Instruments", href: "/instruments", icon: Scale },
  { title: "Tests", href: "/tests", icon: ClipboardCheck },
  { title: "Reports", href: "/reports", icon: FileText },
];

const operationsNavItems: NavItem[] = [
  { title: "Repository", href: "/documents", icon: FolderOpen },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Audit Log", href: "/audit", icon: History },
];

const adminNavItems: NavItem[] = [
  { title: "Users", href: "/users", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
];

function NavGroup({
  label,
  items,
  currentPath,
}: {
  label: string;
  items: NavItem[];
  currentPath: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== "/dashboard" && currentPath.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-xs h-5 min-w-5 justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm shrink-0">
            M
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">
              metro<span className="text-primary font-bold">LAB</span>
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              An initiative by Team Techxi
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Platform" items={mainNavItems} currentPath={pathname} />
        <NavGroup label="Operations" items={operationsNavItems} currentPath={pathname} />
        <NavGroup label="Administration" items={adminNavItems} currentPath={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="text-[10px] text-muted-foreground text-center group-data-[collapsible=icon]:hidden">
          metroLAB v1.0 · SIH 2026
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
