
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ScanSearch,
  ShieldCheck,
  BookOpen,
  Loader2,
} from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { UserNav } from "@/components/user-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/assessment", icon: ScanSearch, label: "Career Assessment" },
  { href: "/skill-gap", icon: GraduationCap, label: "Skill Gap Analysis" },
  { href: "/resume", icon: FileText, label: "Resume Optimizer" },
  { href: "/jobs", icon: Briefcase, label: "Job Listings" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
];

const adminNavItem = { href: "/admin", icon: ShieldCheck, label: "Admin" };

function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.email === 'sadmisn@gmail.com';

  return (
    <Sidebar>
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
           {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(adminNavItem.href)}
                tooltip={adminNavItem.label}
              >
                <Link href={adminNavItem.href}>
                  <adminNavItem.icon />
                  <span>{adminNavItem.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/40 bg-card/50 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <SidebarTrigger variant="outline" size="icon" className="sm:hidden" />
      <div className="flex-1" />
      <DarkModeToggle />
      <UserNav />
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
