
"use client";

import React, { useState, useEffect } from 'react';
import { GroupSetupForm } from "@/components/groups/GroupSetupForm";
import { GroupCard } from "@/components/groups/GroupCard";
import { getGroups, assignmentGroups as staticGroups } from "@/lib/data"; // Using staticGroups for refresh
import type { AssignmentGroup } from "@/lib/types";
import { useAppContext } from "@/hooks/useAppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function GroupsPage() {
  const { currentUser, role } = useAppContext();
  const [groups, setGroups] = useState<AssignmentGroup[]>(getGroups());
  const [searchTerm, setSearchTerm] = useState("");

  // Function to refresh groups from the source (simulated)
  const refreshGroups = () => {
    // In a real app, this would be an API call. Here, we re-fetch from potentially updated mock data.
    // To ensure updates from addGroup/joinGroup in data.ts are reflected if it modifies the array in place:
    setGroups([...staticGroups]);
  };

  useEffect(() => {
    refreshGroups();
  }, []);

  const filteredGroups = groups.filter(group => 
    group.assignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.unitId && getUnitById(group.unitId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const myGroups = filteredGroups.filter(g => g.members.some(m => m.id === currentUser.id) || g.createdBy.id === currentUser.id);
  const availableGroups = filteredGroups.filter(g => !g.members.some(m => m.id === currentUser.id) && g.createdBy.id !== currentUser.id && g.members.length < g.maxSize);


  return (
    <div className="container mx-auto py-2">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
            <Users className="mr-3 h-10 w-10"/> Assignment Groups
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {role === 'class_representative' 
            ? "Create and manage assignment groups for your class." 
            : "Find and join assignment groups for your courses."}
        </p>
      </header>

      {role === 'class_representative' && (
        <div className="mb-8">
          <GroupSetupForm onGroupCreated={refreshGroups} />
        </div>
      )}

      <Card className="mb-8">
        <CardContent className="p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search"
                    placeholder="Search groups by name or unit..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="available">Available to Join</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups / Created</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
            {availableGroups.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {availableGroups.map((group) => (
                <GroupCard key={group.id} group={group} onGroupJoinedOrUpdated={refreshGroups} />
                ))}
            </div>
            ) : (
            <Card className="mt-6">
                <CardContent className="py-10 text-center">
                <p className="text-xl text-muted-foreground">No available groups found matching your search.</p>
                {role === 'student' && <p className="mt-2">Check back later or contact your class representative.</p>}
                </CardContent>
            </Card>
            )}
        </TabsContent>
        <TabsContent value="my-groups">
           {myGroups.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {myGroups.map((group) => (
                <GroupCard key={group.id} group={group} onGroupJoinedOrUpdated={refreshGroups} />
                ))}
            </div>
            ) : (
            <Card className="mt-6">
                <CardContent className="py-10 text-center">
                <p className="text-xl text-muted-foreground">You are not part of any groups, nor have you created any that match your search.</p>
                </CardContent>
            </Card>
            )}
        </TabsContent>
      </Tabs>

    </div>
  );
}

// Helper, assuming it's available from data.ts or defined here
const getUnitById = (unitId: string) => {
    return (staticGroups.find(g => g.unitId === unitId) as any)?.unitName || unitId; // simplified
}
