"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  units as unitsApi,
  documents as documentsApi,
  groups as groupsApi,
  type ApiUnit,
  type ApiDocument,
  type ApiGroup,
} from "@/lib/api";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { GroupCard } from "@/components/groups/GroupCard";
import { GroupSetupForm } from "@/components/groups/GroupSetupForm";
import { useAppContext } from "@/hooks/useAppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users as UsersIcon, AlertCircle, Search, Upload } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useRouter } from "next/navigation";

interface UnitRoomPageProps {
  params: {
    semesterId: string; // actually courseServerId
    unitId: string;
  };
}

export default function UnitRoomPage({ params }: UnitRoomPageProps) {
  const { currentUser } = useAppContext();
  const router = useRouter();
  const unitId = parseInt(params.unitId, 10);

  const [unit, setUnit] = useState<ApiUnit | null>(null);
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadGroups = useCallback(async () => {
    if (!unitId) return;
    try {
      const res = await groupsApi.list(unitId);
      setGroups(res.groups);
    } catch {
      setGroups([]);
    }
  }, [unitId]);

  useEffect(() => {
    if (!currentUser || !unitId) return;

    setIsLoading(true);
    Promise.all([
      unitsApi.get(unitId),
      documentsApi.list(unitId),
      groupsApi.list(unitId),
    ])
      .then(([unitRes, docsRes, groupsRes]) => {
        setUnit(unitRes.unit);
        setDocuments(docsRes.documents);
        setGroups(groupsRes.groups);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [currentUser, unitId]);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const role = currentUser?.role;

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (notFound || !unit) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-background">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Unit Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          This unit could not be found. It may have been removed or you may not have access.
        </p>
        <Button asChild variant="default" size="lg">
          <Link href="/rooms">
            <ArrowLeft className="mr-2 h-5 w-5" /> Go back to All Rooms
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <header className="mb-4 flex items-center gap-4">
        <Button asChild variant="outline" size="icon" aria-label="Back to all rooms">
          <Link href="/rooms">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-headline text-primary">{unit.name}</h1>
          <p className="text-md text-muted-foreground mt-1">
            {unit.unit_code && <span className="font-mono mr-2">[{unit.unit_code}]</span>}
            {unit.description}
          </p>
        </div>
        {(role === 'class_rep' || role === 'lecturer') && (
          <Button variant="outline" onClick={() => router.push(`/documents/add?unitId=${unit.id}`)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Doc
          </Button>
        )}
      </header>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <BookOpen className="mr-3 h-7 w-7 text-primary" />
            Unit Documents
          </CardTitle>
          <CardDescription>
            All learning materials and resources for this unit. ({documents.length} found)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-center">
              No documents uploaded yet for this unit.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Groups Section */}
      <div>
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-headline flex items-center">
            <UsersIcon className="mr-3 h-7 w-7 text-primary" />
            Assignment Groups
          </CardTitle>
          <CardDescription>
            Join or manage groups for assignments in this unit. ({groups.length} total)
          </CardDescription>
        </CardHeader>

        {role === 'class_rep' && (
          <div className="mb-6">
            <GroupSetupForm unitId={unit.id} onGroupsCreated={loadGroups} />
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search groups by name..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onGroupJoinedOrUpdated={loadGroups}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-lg text-muted-foreground">
                No assignment groups found{searchTerm && " matching your search"}.
              </p>
              {role === 'class_rep' && !searchTerm && (
                <p className="mt-2">Use the Auto-Setup form above to create groups for this unit.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
