"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppContext } from "@/hooks/useAppContext";
import { BookOpen, Users, Bell, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StudyTipCard from "@/components/StudyTipCard";

export default function DashboardPage() {
  const { currentUser } = useAppContext();

  const quickStats = [
    { title: "Total Documents", value: "125", icon: BookOpen, color: "text-primary", href: "/rooms" },
    { title: "Active Groups", value: "8", icon: Users, color: "text-accent", href: "/rooms" },
    { title: "Unread Notifications", value: "3", icon: Bell, color: "text-yellow-500", href: "/notifications" },
  ];

  return (
    <div className="container mx-auto py-6">
      {/* Welcome Banner */}
      <Card className="mb-8 shadow-lg border-none bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            Welcome back, {currentUser.name}!
          </CardTitle>
          <CardDescription className="text-lg text-purple-200">
            Here's your academic overview. Manage your tasks and resources efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-300">
            You are currently logged in as a{" "}
            <span className="font-semibold capitalize">
              {currentUser.role.replace("_", " ")}
            </span>.
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {quickStats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground pt-1">View details</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <BookOpen className="mr-3 h-7 w-7 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/rooms" className="block p-4 border rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center mb-1">
              <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg text-primary">Explore Rooms</h3>
            </div>
            <p className="text-sm text-muted-foreground">Access documents and groups organized by semester and unit.</p>
          </Link>
        </CardContent>
      </Card>

      {/* Study Tip Card */}
      <StudyTipCard />
    </div>
  );
}
