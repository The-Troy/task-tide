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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground mx-auto mb-4"></div>
          <p className="text-gray-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-transparent px-6 shadow-sm">
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
        <main className="flex-1 flex-col p-6 bg-transparent">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}