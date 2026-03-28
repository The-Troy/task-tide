"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/hooks/useAppContext";
import { Loader2, CheckCircle, AlertCircle, Users, School } from "lucide-react";
import Link from "next/link";
import { courseServers, type ApiCourseServer } from "@/lib/api";

interface JoinPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function JoinClassroomPage({ params }: JoinPageProps) {
  const { code } = use(params);
  const [server, setServer] = useState<ApiCourseServer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  const handleJoinServer = async () => {
    setIsJoining(true);
    try {
      const { course_server } = await courseServers.join(code);
      setServer(course_server);
      setHasJoined(true);
      toast({
        title: "Successfully Joined!",
        description: `Welcome to ${course_server.name}!`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to join course server.";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsJoining(false);
    }
  };

  // Kick off join immediately once authenticated
  useEffect(() => {
    if (!isAuthenticated || isLoading || hasJoined || error) return;
    setIsLoading(true);
    handleJoinServer().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <School className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl font-headline">Join Course Server</CardTitle>
            <CardDescription>You need to be logged in to join a course server.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button asChild className="w-full">
              <Link href={`/login?redirect=/join/${code}`}>Sign In to Continue</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || isJoining) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Joining course server…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-2xl font-headline text-destructive">
              Could Not Join
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

  if (hasJoined && server) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle className="text-2xl font-headline text-green-600">
              Successfully Joined!
            </CardTitle>
            <CardDescription>
              Welcome to <strong>{server.name}</strong>! You can now access all course resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Users className="h-4 w-4" />
              {server.members_count ?? 0} member{(server.members_count ?? 0) !== 1 ? "s" : ""}
            </div>
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

  return null;
}