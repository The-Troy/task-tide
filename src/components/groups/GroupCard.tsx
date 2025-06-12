
"use client";

import type { AssignmentGroup, User } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, CheckCircle, Info, ShieldCheck } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import { useToast } from "@/hooks/use-toast";
import { getUnitById, getSemesterById } from "@/lib/data";

interface GroupCardProps {
  group: AssignmentGroup;
  onGroupJoinedOrUpdated: () => void;
}

export function GroupCard({ group, onGroupJoinedOrUpdated }: GroupCardProps) {
  const { currentUser, role, joinGroup } = useAppContext();
  const { toast } = useToast();

  const isMember = group.members.some(member => member.id === currentUser.id);
  const isFull = group.members.length >= group.maxSize;
  const canJoin = role === 'student' && !isMember && !isFull;

  const unit = group.unitId ? getUnitById(group.unitId) : null;
  const semester = group.semesterId ? getSemesterById(group.semesterId) : null;

  const handleJoinGroup = () => {
    if (joinGroup(group.id)) {
      toast({
        title: "Successfully Joined Group!",
        description: `You have joined the group for "${group.assignmentName}".`,
      });
      onGroupJoinedOrUpdated();
    } else {
      toast({
        title: "Failed to Join Group",
        description: "Could not join the group. It might be full, or you may already be a member of another group for this assignment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-headline mb-1">{group.assignmentName}</CardTitle>
            {role === 'class_representative' && group.createdBy.id === currentUser.id && (
                <Badge variant="default" className="bg-primary text-primary-foreground"><ShieldCheck className="w-3 h-3 mr-1"/> You Created</Badge>
            )}
        </div>
        <CardDescription className="text-sm">
          Max Size: <Badge variant="secondary">{group.maxSize}</Badge> | 
          Members: <Badge variant={isFull ? "destructive" : "outline"}>{group.members.length} / {group.maxSize}</Badge>
        </CardDescription>
        {(unit || semester) && (
            <div className="text-xs text-muted-foreground mt-1 space-x-1">
                {semester && <span>{semester.name}</span>}
                {semester && unit && <span>&bull;</span>}
                {unit && <span>{unit.name}</span>}
            </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-muted-foreground">Members:</h4>
          {group.members.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {group.members.map(member => (
                <li key={member.id} className={member.id === currentUser.id ? "font-bold text-primary" : ""}>
                  {member.name} {member.id === currentUser.id && "(You)"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">No members yet.</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Created by: {group.createdBy.name}</p>
      </CardContent>
      <CardFooter>
        {role === 'student' && (
          <>
            {isMember ? (
              <Button disabled variant="outline" className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" /> Joined
              </Button>
            ) : isFull ? (
              <Button disabled variant="outline" className="w-full">
                <Info className="mr-2 h-4 w-4" /> Group Full
              </Button>
            ) : (
              <Button onClick={handleJoinGroup} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <UserPlus className="mr-2 h-4 w-4" /> Join Group
              </Button>
            )}
          </>
        )}
        {role === 'class_representative' && (
           <Button disabled variant="outline" className="w-full">
             <Users className="mr-2 h-4 w-4" /> Manage Group (Future)
           </Button>
        )}
      </CardFooter>
    </Card>
  );
}
