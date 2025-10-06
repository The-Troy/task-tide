"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/hooks/useAppContext";
import { Loader2, CheckCircle, AlertCircle, Users, School } from "lucide-react";
import Link from "next/link";
import { findServerByJoinCode, addStudentToServer } from "@/lib/firestore";
import type { CourseServer } from "@/lib/types";

interface JoinPageProps {
  params: {
    code: string;
  };
}

export default function JoinClassroomPage({ params }: JoinPageProps) {
  const [server, setServer] = useState<CourseServer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser, isAuthenticated } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const findServer = async () => {
      try {
        const foundServer = await findServerByJoinCode(params.code);
        
        if (foundServer) {
          setServer(foundServer);
        } else {
          setError("Invalid join code. The course server you're looking for doesn't exist.");
        }
      } catch (err) {
        setError("Failed to load server information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    findServer();
  }, [params.code]);

  const handleJoinServer = async () => {
    if (!currentUser || !server) return;


    setIsJoining(true);
    try {
      // Check if already a member
      if (server.members.includes(currentUser.id)) {
        toast({
          title: "Already Joined",
          description: "You are already a member of this course server.",
          variant: "destructive",
        });
        return;
      }

      // Add user to server
      await addStudentToServer(server.id, currentUser.id);
      
      // Update local state
      server.members.push(currentUser.id);
      setHasJoined(true);
      
      toast({
        title: "Successfully Joined!",
        description: `Welcome to ${server.name}!`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to join course server. Please try again.",
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
            <CardTitle className="text-2xl font-headline">Join Course Server</CardTitle>
            <CardDescription>
              You need to be logged in to join a course server.
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
            <p className="text-muted-foreground">Loading server information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !server) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-2xl font-headline text-destructive">
              Course Server Not Found
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
              Welcome to {server.name}! You can now access all course resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button asChild className="w-full">
              <Link href="/rooms">Explore Course Server</Link>
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
          <CardTitle className="text-2xl font-headline">Join Course Server</CardTitle>
          <CardDescription>
            You've been invited to join a course server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">{server.name}</CardTitle>
              <CardDescription>
                {server.year} • {server.semester}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                {server.members.length} member{server.members.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <Button 
              onClick={handleJoinServer} 
              disabled={isJoining}
              className="w-full"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Course Server"
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