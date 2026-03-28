'use client';

import { useState, useEffect, useCallback } from "react";
import { units as unitsApi, courseServers as courseServersApi, type ApiUnit, type ApiCourseServer } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookCopy, Server, Plus, Hash, Crown } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import CreateServerDialog from "@/components/CreateServerDialog";
import JoinServerDialog from "@/components/JoinServerDialog";

// Helper to get a consistent color from a predefined list based on string hash
const colorClasses = [
  "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500",
  "bg-blue-500", "bg-cyan-500", "bg-teal-500", "bg-green-500",
  "bg-lime-500", "bg-yellow-500", "bg-amber-500", "bg-orange-500",
  "bg-rose-500", "bg-fuchsia-500", "bg-violet-500", "bg-sky-500",
  "bg-emerald-500",
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function getColorClass(name: string): string {
  return colorClasses[Math.abs(hashCode(name)) % colorClasses.length];
}

export default function AllUnitsPage() {
  const { currentUser } = useAppContext();
  const isClassRep = currentUser?.role === 'class_rep';

  const [servers, setServers] = useState<ApiCourseServer[]>([]);
  const [allUnits, setAllUnits] = useState<ApiUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const loadData = useCallback(() => {
    if (!currentUser) return;
    setIsLoading(true);
    Promise.all([courseServersApi.list(), unitsApi.list()])
      .then(([serverRes, unitRes]) => {
        setServers(serverRes.course_servers);
        setAllUnits(unitRes.units);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreated = (server: ApiCourseServer) => {
    setServers((prev) => [server, ...prev]);
  };

  const handleJoined = (server: ApiCourseServer) => {
    setServers((prev) => {
      if (prev.some((s) => s.id === server.id)) return prev;
      return [server, ...prev];
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  // Group units by their course server
  const unitsByServer = servers.map((server) => ({
    server,
    units: allUnits.filter((u) => u.course_server_id === server.id),
  }));

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary flex items-center">
            <BookCopy className="mr-3 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" /> Browse Units
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2">
            All units across your enrolled course servers.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isClassRep && (
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Server</span>
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowJoin(true)} className="gap-2">
            <Hash className="h-4 w-4" />
            <span>Join Server</span>
          </Button>
        </div>
      </header>

      {unitsByServer.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Server className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-foreground font-semibold mb-2">No course servers yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Create a course server to get started, or join one with a code.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setShowCreate(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Server
              </Button>
              <Button onClick={() => setShowJoin(true)} variant="outline" className="gap-2">
                <Hash className="h-4 w-4" />
                Join with Code
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {unitsByServer.map(({ server, units }) => (
            <section key={server.id}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Server className="h-5 w-5 text-primary flex-shrink-0" />
                <h2 className="text-xl font-semibold font-headline">{server.name}</h2>
                <Badge variant="secondary" className="font-mono text-xs">{server.code}</Badge>
                {server.class_rep_id === currentUser?.id && (
                  <Badge className="gap-1 text-xs">
                    <Crown className="h-3 w-3" /> Admin
                  </Badge>
                )}
              </div>

              {units.length === 0 ? (
                <p className="text-sm text-muted-foreground ml-8">No units in this server yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-0 sm:ml-8">
                  {units.map((unit) => (
                    <Link
                      href={`/rooms/${server.id}/${unit.id}`}
                      key={unit.id}
                      className="block group"
                    >
                      <Card
                        className={`h-36 ${getColorClass(unit.name)} text-white rounded-lg overflow-hidden relative transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl`}
                      >
                        <CardHeader className="p-3 relative z-10">
                          <CardTitle className="text-sm font-semibold leading-tight" title={unit.name}>
                            {unit.name}
                          </CardTitle>
                          {unit.unit_code && (
                            <CardDescription className="text-xs text-white/80">
                              {unit.unit_code}
                            </CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

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
