"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Copy, ExternalLink, School } from "lucide-react";
import { courseServers, type ApiCourseServer } from "@/lib/api";

const classroomSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().optional(),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;

interface CreateClassroomFormProps {
  onClassroomCreated?: (server: ApiCourseServer) => void;
}

export function CreateClassroomForm({ onClassroomCreated }: CreateClassroomFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdServer, setCreatedServer] = useState<ApiCourseServer | null>(null);
  const { toast } = useToast();

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = async (data: ClassroomFormValues) => {
    setIsLoading(true);
    try {
      const { course_server: server } = await courseServers.create({
        name: data.name,
        description: data.description,
      });

      setCreatedServer(server);
      onClassroomCreated?.(server);

      toast({
        title: "Classroom Created!",
        description: `${server.name} has been created successfully.`,
      });

      form.reset();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create classroom.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} copied to clipboard.` });
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedServer(null);
    form.reset();
  };

  const joinLink = createdServer
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${createdServer.code}`
    : "";

  if (createdServer) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90">
            <School className="mr-2 h-4 w-4" />
            Create Classroom
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-primary flex items-center">
              <School className="mr-2 h-6 w-6" />
              Classroom Created!
            </DialogTitle>
            <DialogDescription>
              Share the join code or link with your students.
            </DialogDescription>
          </DialogHeader>

          <Card className="mt-4">
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
                  <Input value={createdServer.code} readOnly className="font-mono" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(createdServer.code, "Join code")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Join Link</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value={joinLink} readOnly className="text-xs" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(joinLink, "Join link")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => window.open(joinLink, "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <School className="mr-2 h-4 w-4" />
          Create Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary flex items-center">
            <PlusCircle className="mr-2 h-6 w-6" />
            Create New Classroom
          </DialogTitle>
          <DialogDescription>
            Create a new classroom. Students can join using the generated code.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bachelor of Information Technology" {...field} />
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
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Classroom"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}