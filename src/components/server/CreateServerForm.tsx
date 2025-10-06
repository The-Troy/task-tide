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
import { createCourseServer } from "@/lib/firestore";
import type { CourseServer } from "@/lib/types";

const serverSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  year: z.string().min(4, "Year must be at least 4 characters"),
  semester: z.string().min(1, "Semester is required"),
});

type ServerFormValues = z.infer<typeof serverSchema>;

interface CreateServerFormProps {
  onServerCreated: () => void;
  onCancel?: () => void;
}

export function CreateServerForm({ onServerCreated, onCancel }: CreateServerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [createdServer, setCreatedServer] = useState<CourseServer | null>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      year: "",
      semester: "",
    },
  });

  const onSubmit = async (data: ServerFormValues) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const server = await createCourseServer({
        name: data.name,
        year: data.year,
        semester: data.semester,
        createdBy: currentUser.id,
        members: [currentUser.id],
        maxGroupsPerUnit: 50,
      });
      
      setCreatedServer(server);
      
      toast({
        title: "Course Server Created!",
        description: `${server.name} has been created successfully.`,
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course server. Please try again.",
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

  const handleComplete = () => {
    onServerCreated();
  };

  if (createdServer) {
    return (
      <Card className="shadow-2xl">
        <CardHeader className="text-center">
          <School className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl font-headline text-primary">
            Course Server Created!
          </CardTitle>
          <CardDescription>
            Your course server has been created successfully. Share the join code with your classmates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">{createdServer.name}</CardTitle>
              <CardDescription>
                {createdServer.year} • {createdServer.semester}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Join Code</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={createdServer.joinCode}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(createdServer.joinCode, "Join code")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Join Link</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={createdServer.joinLink}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(createdServer.joinLink, "Join link")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => window.open(createdServer.joinLink, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
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
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Spring, Fall, Semester 1" {...field} />
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