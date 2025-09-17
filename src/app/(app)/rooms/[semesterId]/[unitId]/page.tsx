
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getUnitById, getSemesterById, getDocumentsByUnit, assignmentGroups as staticGroupsData } from "@/lib/data";
import type { DocumentFile, AssignmentGroup, Unit, Semester } from "@/lib/types";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { GroupCard } from "@/components/groups/GroupCard";
import { GroupSetupForm } from "@/components/groups/GroupSetupForm";
import { useAppContext } from "@/hooks/useAppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users as UsersIcon, FolderOpen, AlertCircle, Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface UnitRoomPageProps {
  params: {
    semesterId: string;
    unitId: string;
  };
}

export default function UnitRoomPage({ params }: UnitRoomPageProps) {
  const { currentUser, role } = useAppContext();
  const [unit, setUnit] = useState<Unit | null | undefined>(null);
  const [semester, setSemester] = useState<Semester | null | undefined>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [groups, setGroups] = useState<AssignmentGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refreshGroups = useCallback(() => {
    setGroups([...staticGroupsData].filter(g => g.unitId === params.unitId && g.semesterId === params.semesterId));
  }, [params.unitId, params.semesterId]);
  
  useEffect(() => {
    setIsLoading(true);
    const foundSemester = getSemesterById(params.semesterId);
    const foundUnit = getUnitById(params.unitId);
    
    setSemester(foundSemester);
    setUnit(foundUnit);

    if (foundUnit && foundSemester) {
      const unitDocuments = getDocumentsByUnit(foundSemester.id, foundUnit.id);
      setDocuments(unitDocuments);
      refreshGroups();
    }
    setIsLoading(false);
  }, [params.semesterId, params.unitId, refreshGroups]);

  const filteredAndSortedGroups = useMemo(() => {
    // Helper function to assign a sorting score to each group
    const getGroupScore = (group: AssignmentGroup): number => {
      const isCreator = group.createdBy.id === currentUser.id;
      const isMember = group.members.some(m => m.id === currentUser.id);
      const isJoinable = !isMember && !isCreator && group.members.length < group.maxSize;
      
      if (isJoinable) return 1; // Highest priority
      if (isCreator) return 2;
      if (isMember) return 3;
      return 4; // Other groups (e.g., full and not a member)
    };
    
    return groups
      .filter(group => group.assignmentName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const scoreA = getGroupScore(a);
        const scoreB = getGroupScore(b);
        if (scoreA !== scoreB) {
          return scoreA - scoreB;
        }
        // If scores are equal, sort alphabetically by name
        return a.assignmentName.localeCompare(b.assignmentName);
      });
  }, [groups, searchTerm, currentUser]);


  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">Loading unit details...</div>;
  }

  if (!unit || !semester) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-background">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Unit or Semester Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          The specific unit or semester you are looking for could not be found. 
          It might have been moved, deleted, or the link might be incorrect.
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
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">
                {unit.name}
            </h1>
            <p className="text-md text-muted-foreground mt-1">
            Resources for {unit.name} in {semester.name}.
            </p>
        </div>
      </header>

      {/* Documents Section */}
      <Card>
          <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center">
                <BookOpen className="mr-3 h-7 w-7 text-primary" />
                Unit Documents
              </CardTitle>
              <CardDescription>All learning materials and resources for this unit. ({documents.length} found)</CardDescription>
          </CardHeader>
          <CardContent>
              {documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {documents.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                  ))}
                  </div>
              ) : (
                  <p className="text-muted-foreground py-4 text-center">No documents found for this unit.</p>
              )}
          </CardContent>
      </Card>

      <Separator className="my-8"/>

      {/* Groups Section */}
      <div>
        <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-headline flex items-center">
                <UsersIcon className="mr-3 h-7 w-7 text-primary" />
                Assignment Groups
            </CardTitle>
            <CardDescription>Join or manage groups for assignments in this unit. ({groups.length} total)</CardDescription>
        </CardHeader>

        {role === 'class_representative' && (
            <div className="mb-6">
            <GroupSetupForm 
                onGroupCreated={refreshGroups} 
                initialSemesterId={params.semesterId}
                initialUnitId={params.unitId}
            />
            </div>
        )}
        
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search"
                        placeholder="Search groups in this unit by assignment name..."
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>

        {filteredAndSortedGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedGroups.map((group) => (
            <GroupCard key={group.id} group={group} onGroupJoinedOrUpdated={refreshGroups} />
            ))}
        </div>
        ) : (
        <Card>
            <CardContent className="py-10 text-center">
            <p className="text-lg text-muted-foreground">
                No assignment groups found for this unit{searchTerm && " matching your search"}.
            </p>
            {role === 'class_representative' && !searchTerm && (
                <p className="mt-2">You can create a new group using the form above.</p>
            )}
            </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
