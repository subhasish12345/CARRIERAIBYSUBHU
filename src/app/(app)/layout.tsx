
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ScanSearch,
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

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/assessment", icon: ScanSearch, label: "Career Assessment" },
  { href: "/skill-gap", icon: GraduationCap, label: "Skill Gap Analysis" },
  { href: "/resume", icon: FileText, label: "Resume Optimizer" },
  { href: "/jobs", icon: Briefcase, label: "Job Listings" },
];

function AppSidebar() {
  const pathname = usePathname();
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
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-16 sm:px-6">
      <SidebarTrigger variant="outline" size="icon" className="sm:hidden" />
      <div className="flex-1" />
      <UserNav />
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
