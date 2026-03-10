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
import { courseServers, type ApiCourseServer } from "@/lib/api";
import { UserPlus, CheckCircle, Users, ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [joinedServer, setJoinedServer] = useState<ApiCourseServer | null>(null);
  const { toast } = useToast();

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: { joinCode: "" },
  });

  const onSubmit = async (data: JoinFormValues) => {
    setIsLoading(true);
    try {
      const { course_server } = await courseServers.join(data.joinCode.trim());
      setJoinedServer(course_server);
      toast({
        title: "Successfully Joined!",
        description: `You have joined ${course_server.name}.`,
      });
      form.reset();
    } catch (err: unknown) {
      toast({
        title: "Failed to Join",
        description: err instanceof Error ? err.message : "Invalid join code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">{joinedServer.code}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {joinedServer.members_count ?? "—"} members
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {joinedServer.units?.length ?? 0} units
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={onServerJoined} size="lg">
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
          Enter the join code provided by your class rep to access a server.
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
                      placeholder="e.g., ABC123XY"
                      className="font-mono uppercase"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining…</>
                ) : (
                  "Join Server"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
