"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/hooks/useAppContext";
import { UserPlus, CheckCircle, Users, ArrowLeft, School } from "lucide-react";
import { findServerByJoinCode, addStudentToServer } from "@/lib/firestore";
import type { CourseServer } from "@/lib/types";

const joinSchema = z.object({
  joinCode: z.string().min(1, "Join code is required"),
});

type JoinFormValues = z.infer<typeof joinSchema>;

interface JoinServerFormProps {
  onServerJoined: () => void;
  onCancel?: () => void;
}

export function JoinServerForm({ onServerJoined, onCancel }: JoinServerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [joinedServer, setJoinedServer] = useState<CourseServer | null>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      joinCode: "",
    },
  });

  const onSubmit = async (data: JoinFormValues) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const server = await findServerByJoinCode(data.joinCode);
      
      if (!server) {
        toast({
          title: "Invalid Code",
          description: "The join code you entered is not valid. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if already a member
      if (server.members.includes(currentUser.id)) {
        toast({
          title: "Already Joined",
          description: "You are already a member of this course server.",
          variant: "destructive",
        });
        return;
      }

      await addStudentToServer(server.id, currentUser.id);
      setJoinedServer(server);
      
      toast({
        title: "Successfully Joined!",
        description: `You have joined ${server.name}.`,
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join course server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onServerJoined();
  };

  if (joinedServer) {
    return (
      <Card className="shadow-2xl">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-2xl font-headline text-green-600">
            Successfully Joined!
          </CardTitle>
          <CardDescription>
            Welcome to {joinedServer.name}! You can now access all course resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">{joinedServer.name}</CardTitle>
              <CardDescription>
                {joinedServer.year} • {joinedServer.semester}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                {joinedServer.members.length} member{joinedServer.members.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button onClick={handleComplete} size="lg">
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          {onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="mx-auto bg-accent text-accent-foreground rounded-full p-3 w-fit">
            <UserPlus className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-headline text-primary">
          Join Course Server
        </CardTitle>
        <CardDescription>
          Enter the join code provided by your course admin to join a server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., BSC25-ABC" 
                      className="font-mono uppercase"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Demo codes to try:</strong>
              </p>
              <div className="mt-1 space-y-1">
                <p className="text-xs font-mono">BSC25-ABC</p>
                <p className="text-xs font-mono">CSF25-XYZ</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Server"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}