
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bell,
  SettingsIcon,
  PlusSquare,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAppContext } from "@/hooks/useAppContext";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const { role } = useAppContext();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/documents", label: "Documents", icon: FolderKanban },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  if (role === 'class_representative') {
    // Example of adding a role-specific item, or you can modify existing items/pages
    // For now, group creation is handled within the /groups page itself.
  }

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
              <item.icon className="h-5 w-5" />
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
