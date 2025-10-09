"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppContext } from "@/hooks/useAppContext";
import { BookOpen, Users, Bell, LayoutGrid, Plus, Server } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StudyTipCard from "@/components/StudyTipCard";
import { CreateServerForm } from "@/components/server/CreateServerForm";
import { JoinServerForm } from "@/components/server/JoinServerForm";
import { useState, useEffect } from "react";
import { getUserServers } from "@/lib/firestore";
import type { CourseServer } from "@/lib/types";

export default function DashboardPage() {
  const { currentUser } = useAppContext();
  const [userServers, setUserServers] = useState<CourseServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!currentUser) {
    return null;
  }

  useEffect(() => {
    const loadUserServers = async () => {
      try {
        const servers = await getUserServers(currentUser.id);
        setUserServers(servers);
      } catch (error) {
        console.error("Failed to load user servers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserServers();
  }, [currentUser.id]);

  const refreshServers = async () => {
    const servers = await getUserServers(currentUser.id);
    setUserServers(servers);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

      {/* Course Servers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <Server className="mr-3 h-7 w-7 text-primary" />
            Your Course Servers
          </CardTitle>
          <CardDescription>
            Servers you've created or joined ({userServers.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userServers.map((server) => (
              <Link href="/rooms" key={server.id}>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Server className="mr-2 h-5 w-5 text-primary" />
                      {server.name}
                    </CardTitle>
                    <CardDescription>
                      {server.year} • {server.semester}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {server.members.length} member{server.members.length !== 1 ? "s" : ""}
                      {server.createdBy === currentUser.id && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Add Server Button */}
            <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-primary mb-2">Add Server</h3>
                <p className="text-sm text-muted-foreground">Create or join another course server</p>
              </CardContent>
            </Card>
          </div>
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
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <CreateServerForm onServerCreated={refreshServers} />
            <JoinServerForm onServerJoined={refreshServers} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/rooms"
              className="block p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center mb-1">
                <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg text-primary">Explore Course Units</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Access documents and groups organized by semester and unit.
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>

      <StudyTipCard />
    </div>
  );
}
