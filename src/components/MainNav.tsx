
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Calendar,
  SettingsIcon,
  LayoutGrid,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAppContext } from "@/hooks/useAppContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { invitations as invitationsApi } from "@/lib/api";

export function MainNav() {
  const pathname = usePathname();
  const { currentUser } = useAppContext();
  const [pendingCount, setPendingCount] = useState(0);

  // Poll pending invitations count every 30s for the badge
  useEffect(() => {
    if (!currentUser) return;
    const check = () => {
      invitationsApi.list()
        .then(({ invitations }) => {
          setPendingCount(invitations.filter((i) => i.status === "pending").length);
        })
        .catch(() => {});
    };
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/rooms", label: "Course Units", icon: LayoutGrid },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/notifications", label: "Notifications", icon: Bell, badge: pendingCount },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={{ children: item.label, className: "text-xs" }}
            className={cn(
              "justify-start",
              pathname.startsWith(item.href)
                ? "bg-sidebar-primary-foreground text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Link href={item.href}>
              <span className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </span>
              <span className="group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
