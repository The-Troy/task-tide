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
import { useAppContext } from "@/hooks/useAppContext";
import { PlusCircle, Copy, ExternalLink, School } from "lucide-react";
import { createClassroom } from "@/lib/firestore";
import type { Classroom } from "@/lib/types";

const classroomSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  year: z.string().min(4, "Year must be at least 4 characters"),
  semester: z.string().min(1, "Semester is required"),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;

interface CreateClassroomFormProps {
  onClassroomCreated?: (classroom: Classroom) => void;
}

export function CreateClassroomForm({ onClassroomCreated }: CreateClassroomFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdClassroom, setCreatedClassroom] = useState<Classroom | null>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: "",
      year: "",
      semester: "",
    },
  });

  const generateJoinCode = (courseName: string, year: string): string => {
    // Extract first 3 letters from course name and combine with year
    const coursePrefix = courseName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const yearSuffix = year.substring(2); // Last 2 digits of year
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${coursePrefix}${yearSuffix}-${randomSuffix}`;
  };

  const createClassroom = async (data: ClassroomFormValues): Promise<Classroom> => {
    const joinCode = generateJoinCode(data.name, data.year);
    const joinLink = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/join/${joinCode}`;
    
    const classroomData = {
      name: data.name,
      year: data.year,
      semester: data.semester,
      joinCode,
      joinLink,
      createdBy: currentUser?.id || '',
      members: [],
    };
    
    return await createClassroom(classroomData);
  };

  const onSubmit = async (data: ClassroomFormValues) => {
    if (!currentUser || currentUser.role !== 'class_representative') {
      toast({
        title: "Permission Denied",
        description: "Only class representatives can create classrooms.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const classroom = await createClassroom(data);
      setCreatedClassroom(classroom);
      onClassroomCreated?.(classroom);
      
      toast({
        title: "Classroom Created!",
        description: `${classroom.name} has been created successfully.`,
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create classroom. Please try again.",
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

  const handleClose = () => {
    setIsOpen(false);
    setCreatedClassroom(null);
    form.reset();
  };

  if (createdClassroom) {
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
              Your classroom has been created successfully. Share the join code or link with your students.
            </DialogDescription>
          </DialogHeader>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">{createdClassroom.name}</CardTitle>
              <CardDescription>
                {createdClassroom.year} • {createdClassroom.semester}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Join Code</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={createdClassroom.joinCode}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(createdClassroom.joinCode, "Join code")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Join Link</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={createdClassroom.joinLink}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(createdClassroom.joinLink, "Join link")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => window.open(createdClassroom.joinLink, '_blank')}
                  >
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
            Create a new classroom for your course. Students can join using the generated code.
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
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