'use client';

import { useState, useEffect } from "react";
import { units as unitsApi, courseServers as courseServersApi, type ApiUnit, type ApiCourseServer } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookCopy, Server } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";

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
  const [servers, setServers] = useState<ApiCourseServer[]>([]);
  const [allUnits, setAllUnits] = useState<ApiUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    Promise.all([courseServersApi.list(), unitsApi.list()])
      .then(([serverRes, unitRes]) => {
        setServers(serverRes.course_servers);
        setAllUnits(unitRes.units);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <BookCopy className="mr-3 h-10 w-10" /> Browse Units
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          All units across your enrolled course servers.
        </p>
      </header>

      {unitsByServer.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Server className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No course servers joined yet.</p>
            <p className="mt-2 text-sm">Ask your class rep for a join code to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {unitsByServer.map(({ server, units }) => (
            <section key={server.id}>
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold font-headline">{server.name}</h2>
                <Badge variant="secondary" className="font-mono text-xs">{server.code}</Badge>
              </div>

              {units.length === 0 ? (
                <p className="text-sm text-muted-foreground ml-8">No units in this server yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ml-8">
                  {units.map((unit) => (
                    <Link
                      href={`/rooms/${server.id}/${unit.id}`}
                      key={unit.id}
                      className="block group"
                    >
                      <Card
                        className={`h-40 ${getColorClass(unit.name)} text-white rounded-lg overflow-hidden relative transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl`}
                      >
                        <CardHeader className="p-3 relative z-10">
                          <CardTitle className="text-base font-semibold leading-tight" title={unit.name}>
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
    </div>
  );
}
