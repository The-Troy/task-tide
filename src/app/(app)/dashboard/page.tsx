"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppContext } from "@/hooks/useAppContext";
import { Users, Plus, Server, BookOpen, Hash, Crown } from "lucide-react";
import Link from "next/link";
import StudyTipCard from "@/components/StudyTipCard";
import { useState, useEffect, useCallback } from "react";
import { courseServers, type ApiCourseServer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import CreateServerDialog from "@/components/CreateServerDialog";
import JoinServerDialog from "@/components/JoinServerDialog";

export default function DashboardPage() {
  const { currentUser } = useAppContext();
  const isClassRep = currentUser?.role === 'class_rep';

  const [servers, setServers] = useState<ApiCourseServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const loadServers = useCallback(() => {
    if (!currentUser) return;
    courseServers
      .list()
      .then(({ course_servers }) => setServers(course_servers))
      .catch(() => setServers([]))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  useEffect(() => { loadServers(); }, [loadServers]);

  const handleCreated = (server: ApiCourseServer) => {
    setServers((prev) => [server, ...prev]);
  };

  const handleJoined = (server: ApiCourseServer) => {
    setServers((prev) => {
      if (prev.some((s) => s.id === server.id)) return prev;
      return [server, ...prev];
    });
  };

  if (!currentUser) return null;

  const totalUnits = servers.reduce((sum, s) => sum + (s.units?.length ?? 0), 0);

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Welcome Banner */}
      <Card className="shadow-lg border-none bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-headline">
                Welcome back, {currentUser.name.split(" ")[0]}! 👋
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-purple-200 mt-1">
                Here's your academic overview.
              </CardDescription>
            </div>
            {isClassRep && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-3 py-1.5 rounded-full w-fit">
                <Crown className="h-3.5 w-3.5" />
                Class Representative
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-300">
            Signed in as a{" "}
            <span className="font-semibold capitalize">
              {currentUser.role.replace(/_/g, " ")}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-headline flex items-center">
                <Server className="mr-3 h-6 w-6 text-primary flex-shrink-0" />
                Your Courses
              </CardTitle>
              <CardDescription>
                Servers you've created or joined ({servers.length} total)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Create
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowJoin(true)} className="gap-1.5">
                <Hash className="h-3.5 w-3.5" />
                Join
              </Button>
            </div>
          </div>
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

              {/* Empty state card */}
              {servers.length === 0 && (
                <Card className="border-2 border-dashed border-primary/30 col-span-full">
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <Server className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="font-semibold text-foreground mb-1">No servers yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a course server to get started, or join one with a code.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Create Server
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowJoin(true)} className="gap-1.5">
                        <Hash className="h-3.5 w-3.5" /> Join with Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Add more card */}
              {servers.length > 0 && (
                <Card
                  className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => isClassRep ? setShowCreate(true) : setShowJoin(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center min-h-[130px]">
                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                      {isClassRep ? <Plus className="h-8 w-8" /> : <Hash className="h-8 w-8" />}
                    </div>
                    <h3 className="font-semibold text-primary mb-2">
                      {isClassRep ? "Create Server" : "Join Server"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isClassRep ? "Set up a new course server" : "Join with a class rep code"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <StudyTipCard />

      <CreateServerDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCreated}
      />
      <JoinServerDialog
        open={showJoin}
        onOpenChange={setShowJoin}
        onJoined={handleJoined}
      />
    </div>
  );
}