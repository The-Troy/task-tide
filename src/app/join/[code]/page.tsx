"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/hooks/useAppContext";
import { Loader2, CheckCircle, AlertCircle, Users, School } from "lucide-react";
import Link from "next/link";
import { findClassroomByJoinCode, addStudentToClassroom, addClassroomToStudent } from "@/lib/firestore";
import type { Classroom } from "@/lib/types";

interface JoinPageProps {
  params: {
    code: string;
  };
}

export default function JoinClassroomPage({ params }: JoinPageProps) {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser, isAuthenticated } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const findClassroom = async () => {
      try {
        const foundClassroom = await findClassroomByJoinCode(params.code);
        
        if (foundClassroom) {
          setClassroom(foundClassroom);
        } else {
          setError("Invalid join code. The classroom you're looking for doesn't exist.");
        }
      } catch (err) {
        setError("Failed to load classroom information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    findClassroom();
  }, [params.code]);

  const handleJoinClassroom = async () => {
    if (!currentUser || !classroom) return;

    if (currentUser.role !== 'student') {
      toast({
        title: "Permission Denied",
        description: "Only students can join classrooms.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      // Check if already a member
      if (classroom.members.includes(currentUser.id)) {
        toast({
          title: "Already Joined",
          description: "You are already a member of this classroom.",
          variant: "destructive",
        });
        return;
      }

      // Add student to classroom and classroom to student
      await addStudentToClassroom(classroom.id, currentUser.id);
      await addClassroomToStudent(currentUser.id, classroom.id);
      
      // Update local state
      classroom.members.push(currentUser.id);
      setHasJoined(true);
      
      toast({
        title: "Successfully Joined!",
        description: `Welcome to ${classroom.name}!`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to join classroom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <School className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl font-headline">Join Classroom</CardTitle>
            <CardDescription>
              You need to be logged in to join a classroom.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Sign In to Continue</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading classroom information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-2xl font-headline text-destructive">
              Classroom Not Found
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle className="text-2xl font-headline text-green-600">
              Successfully Joined!
            </CardTitle>
            <CardDescription>
              Welcome to {classroom.name}! You can now access all classroom resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button asChild className="w-full">
              <Link href="/rooms">Explore Classroom</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <School className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline">Join Classroom</CardTitle>
          <CardDescription>
            You've been invited to join a classroom
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">{classroom.name}</CardTitle>
              <CardDescription>
                {classroom.year} • {classroom.semester}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                {classroom.members.length} member{classroom.members.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <Button 
              onClick={handleJoinClassroom} 
              disabled={isJoining}
              className="w-full"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Classroom"
              )}
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Maybe Later</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}