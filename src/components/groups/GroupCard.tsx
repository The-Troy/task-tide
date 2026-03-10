"use client";

import { useState } from "react";
import { groups as groupsApi, type ApiGroup } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, CheckCircle, Info, LogOut, Loader2 } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import { useToast } from "@/hooks/use-toast";

interface GroupCardProps {
  group: ApiGroup;
  onGroupJoinedOrUpdated: () => void;
}

export function GroupCard({ group, onGroupJoinedOrUpdated }: GroupCardProps) {
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const [isBusy, setIsBusy] = useState(false);

  if (!currentUser) return null;

  const members = group.members ?? [];
  const isMember = members.some((m) => m.id === currentUser.id);
  const isFull = group.is_full ?? members.length >= group.max_size;
  const memberCount = group.members_count ?? members.length;
  const role = currentUser.role;

  const handleJoin = async () => {
    setIsBusy(true);
    try {
      await groupsApi.join(group.id);
      toast({
        title: "Joined!",
        description: `You joined "${group.name}".`,
      });
      onGroupJoinedOrUpdated();
    } catch (err: unknown) {
      toast({
        title: "Could not join",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleLeave = async () => {
    setIsBusy(true);
    try {
      await groupsApi.leave(group.id);
      toast({
        title: "Left group",
        description: `You left "${group.name}".`,
      });
      onGroupJoinedOrUpdated();
    } catch (err: unknown) {
      toast({
        title: "Could not leave",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-headline mb-1 leading-tight">
            {group.name}
          </CardTitle>
          {isMember && (
            <Badge variant="default" className="bg-green-600 text-white shrink-0">
              Joined
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm flex items-center gap-2">
          <span>Max Size: <Badge variant="secondary">{group.max_size}</Badge></span>
          <span>Members: <Badge variant={isFull ? "destructive" : "outline"}>{memberCount} / {group.max_size}</Badge></span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <h4 className="text-xs font-semibold text-muted-foreground mb-1">Members:</h4>
        {members.length > 0 ? (
          <ul className="list-disc list-inside text-sm space-y-0.5">
            {members.map((member) => (
              <li
                key={member.id}
                className={member.id === currentUser.id ? "font-bold text-primary" : ""}
              >
                {member.name}
                {member.id === currentUser.id && " (You)"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No members yet.</p>
        )}
      </CardContent>

      <CardFooter>
        {role === 'student' && (
          <>
            {isMember ? (
              <Button
                onClick={handleLeave}
                disabled={isBusy}
                variant="outline"
                className="w-full"
              >
                {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                Leave Group
              </Button>
            ) : isFull ? (
              <Button disabled variant="outline" className="w-full">
                <Info className="mr-2 h-4 w-4" /> Group Full
              </Button>
            ) : (
              <Button
                onClick={handleJoin}
                disabled={isBusy}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Join Group
              </Button>
            )}
          </>
        )}
        {(role === 'class_rep' || role === 'lecturer') && (
          <Button disabled variant="outline" className="w-full">
            <Users className="mr-2 h-4 w-4" /> {memberCount} / {group.max_size} Members
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
