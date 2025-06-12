
"use client";

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppLogoSidebar } from "@/components/AppLogo";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "@/components/UserNav";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import Link from 'next/link';
import { useAppContext } from '@/hooks/useAppContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppContext();

  return (
    <SidebarProvider defaultOpen >
      <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <AppLogoSidebar />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter className="p-4">
           {/* Placeholder for any footer items in sidebar if needed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Optional: Breadcrumbs or page title can go here */}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 flex-col p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
