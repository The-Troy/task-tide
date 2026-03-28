"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Copy, ExternalLink, School, ArrowLeft } from "lucide-react";
import { courseServers, type ApiCourseServer } from "@/lib/api";

const serverSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().optional(),
});

type ServerFormValues = z.infer<typeof serverSchema>;

interface CreateServerFormProps {
  onServerCreated: () => void;
  onCancel?: () => void;
}

export function CreateServerForm({ onServerCreated, onCancel }: CreateServerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [createdServer, setCreatedServer] = useState<ApiCourseServer | null>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: ServerFormValues) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const { course_server: server } = await courseServers.create({
        name: data.name,
        description: data.description,
      });

      setCreatedServer(server);

      toast({
        title: "Course Server Created!",
        description: `${server.name} has been created successfully.`,
      });

      form.reset();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const joinLink = createdServer
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${createdServer.code}`
    : "";

  if (createdServer) {
    return (
      <Card className="shadow-2xl">
        <CardHeader className="text-center">
          <School className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline text-primary">
            Course Server Created!
          </CardTitle>
          <CardDescription>
            Your course server has been created. Share the join code with your classmates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">{createdServer.name}</CardTitle>
              {createdServer.description && (
                <CardDescription>{createdServer.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Join Code</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={createdServer.code}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(createdServer.code, "Join code")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Join Link</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={joinLink}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(joinLink, "Join link")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => window.open(joinLink, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={onServerCreated} size="lg">
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
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit">
            <Plus className="h-8 w-8" />
          </div>
        </div>
        <CardTitle className="text-2xl font-headline text-primary">
          Create Course Server
        </CardTitle>
        <CardDescription>
          Set up a new server for your course. You'll become the Server Admin with full control.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., BSc Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Year 2 – Semester 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isLoading ? "Creating..." : "Create Server"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}