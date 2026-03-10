"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppContext } from "@/hooks/useAppContext";
import { Users, Plus, Server, BookOpen } from "lucide-react";
import Link from "next/link";
import StudyTipCard from "@/components/StudyTipCard";
import { useState, useEffect } from "react";
import { courseServers, type ApiCourseServer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { currentUser } = useAppContext();
  const router = useRouter();
  const [servers, setServers] = useState<ApiCourseServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    courseServers
      .list()
      .then(({ course_servers }) => setServers(course_servers))
      .catch(() => setServers([]))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  if (!currentUser) return null;

  const totalUnits = servers.reduce((sum, s) => sum + (s.units?.length ?? 0), 0);

  return (
    <div className="container mx-auto py-6">
      {/* Welcome Banner */}
      <Card className="mb-8 shadow-lg border-none bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            Welcome back, {currentUser.name.split(" ")[0]}! 👋
          </CardTitle>
          <CardDescription className="text-lg text-purple-200">
            Here's your academic overview. Manage your tasks and resources efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-300">
            You are currently logged in as a{" "}
            <span className="font-semibold capitalize">
              {currentUser.role.replace(/_/g, " ")}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{servers.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Course Servers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{totalUnits}</p>
            <p className="text-sm text-muted-foreground mt-1">Units Enrolled</p>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">✉️</p>
            <p className="text-sm text-muted-foreground mt-1">Email Notifications On</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Servers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <Server className="mr-3 h-7 w-7 text-primary" />
            Your Courses
          </CardTitle>
          <CardDescription>
            Servers you've created or joined ({servers.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {servers.map((server) => (
                <Link href="/rooms" key={server.id}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Server className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                        <span className="truncate">{server.name}</span>
                      </CardTitle>
                      <CardDescription className="font-mono text-xs">
                        Code: {server.code}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {server.members_count ?? "—"} members
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {server.units?.length ?? 0} units
                        </span>
                        {server.class_rep_id === currentUser.id && (
                          <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Add Server Button */}
              <Card
                className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => router.push("/rooms")}
              >
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center min-h-[130px]">
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">Browse / Join</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore units or join a new server
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <StudyTipCard />
    </div>
  );
}