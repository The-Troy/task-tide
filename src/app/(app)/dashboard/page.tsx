
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppContext } from "@/hooks/useAppContext";
import { BookOpen, FolderKanban, Users, Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { currentUser } = useAppContext();

  const quickStats = [
    { title: "Total Documents", value: "125", icon: FolderKanban, color: "text-primary", href: "/documents" },
    { title: "Active Groups", value: "8", icon: Users, color: "text-accent", href: "/groups" },
    { title: "Unread Notifications", value: "3", icon: Bell, color: "text-yellow-500", href: "/notifications" },
  ];

  return (
    <div className="container mx-auto py-2">
      <Card className="mb-8 shadow-lg border-none bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Welcome back, {currentUser.name}!</CardTitle>
          <CardDescription className="text-lg text-purple-200">
            Here's your academic overview. Manage your tasks and resources efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-purple-300">You are currently logged in as a <span className="font-semibold capitalize">{currentUser.role.replace('_', ' ')}</span>.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {quickStats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground pt-1">View {stat.title.toLowerCase()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <BookOpen className="mr-3 h-7 w-7 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/documents" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
            <h3 className="font-semibold text-lg text-primary mb-1">Browse Documents</h3>
            <p className="text-sm text-muted-foreground">Access all your course materials organized by semester and unit.</p>
          </Link>
          <Link href="/groups" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
            <h3 className="font-semibold text-lg text-accent mb-1">Manage Groups</h3>
            <p className="text-sm text-muted-foreground">
              {currentUser.role === 'class_representative' ? "Set up new assignment groups or view existing ones." : "Join assignment groups or view your current group memberships."}
            </p>
          </Link>
           <Link href="/settings" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
            <h3 className="font-semibold text-lg mb-1">Update Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your profile information and application preferences.</p>
          </Link>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-6 bg-card rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-primary">Study Tip of the Day</h3>
        <div className="flex items-start gap-4">
          <Image src="https://placehold.co/150x100.png" alt="Study tip illustration" width={150} height={100} className="rounded" data-ai-hint="education study" />
          <div>
            <p className="text-foreground">"Break down large assignments into smaller, manageable tasks. This makes them less daunting and helps maintain momentum."</p>
            <p className="text-sm text-muted-foreground mt-2">- TaskTide Wisdom</p>
          </div>
        </div>
      </div>

    </div>
  );
}
