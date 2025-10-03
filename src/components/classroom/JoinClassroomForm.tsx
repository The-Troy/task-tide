"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { UserPlus, CheckCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { findClassroomByJoinCode, addStudentToClassroom, addClassroomToStudent } from "@/lib/firestore";
import type { Classroom } from "@/lib/types";

const joinSchema = z.object({
  joinCode: z.string().min(1, "Join code is required"),
});

type JoinFormValues = z.infer<typeof joinSchema>;

interface JoinClassroomFormProps {
  onClassroomJoined?: (classroom: Classroom) => void;
}

export function JoinClassroomForm({ onClassroomJoined }: JoinClassroomFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinedClassroom, setJoinedClassroom] = useState<Classroom | null>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      joinCode: "",
    },
  });

  const findClassroomByCode = async (joinCode: string): Promise<Classroom | null> => {
    return await findClassroomByJoinCode(joinCode);
  };

  const joinClassroom = async (classroom: Classroom): Promise<void> => {
    if (!currentUser) return;
    
    // Add student to classroom and classroom to student
    await Promise.all([
      addStudentToClassroom(classroom.id, currentUser.id),
      addClassroomToStudent(currentUser.id, classroom.id)
    ]);
    
    // Update local state
    if (!classroom.members.includes(currentUser.id)) {
      classroom.members.push(currentUser.id);
    }
  };

  const onSubmit = async (data: JoinFormValues) => {
    if (!currentUser || currentUser.role !== 'student') {
      toast({
        title: "Permission Denied",
        description: "Only students can join classrooms.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const classroom = await findClassroomByCode(data.joinCode);
      
      if (!classroom) {
        toast({
          title: "Invalid Code",
          description: "The join code you entered is not valid. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if already a member
      if (classroom.members.includes(currentUser.id)) {
        toast({
          title: "Already Joined",
          description: "You are already a member of this classroom.",
          variant: "destructive",
        });
        return;
      }

      await joinClassroom(classroom);
      setJoinedClassroom(classroom);
      onClassroomJoined?.(classroom);
      
      toast({
        title: "Successfully Joined!",
        description: `You have joined ${classroom.name}.`,
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join classroom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setJoinedClassroom(null);
    form.reset();
  };

  const goToClassroom = () => {
    if (joinedClassroom) {
      // Navigate to classroom page - in real app, this would be the actual classroom route
      router.push(`/rooms`); // For now, redirect to rooms as placeholder
      handleClose();
    }
  };

  if (joinedClassroom) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <UserPlus className="mr-2 h-4 w-4" />
            Join a Classroom
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-primary flex items-center">
              <CheckCircle className="mr-2 h-6 w-6" />
              Successfully Joined!
            </DialogTitle>
            <DialogDescription>
              You have successfully joined the classroom. You can now access units, documents, and groups.
            </DialogDescription>
          </DialogHeader>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">{joinedClassroom.name}</CardTitle>
              <CardDescription>
                {joinedClassroom.year} • {joinedClassroom.semester}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                {joinedClassroom.members.length} member{joinedClassroom.members.length !== 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={goToClassroom}>
              Go to Classroom
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <UserPlus className="mr-2 h-4 w-4" />
          Join a Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary flex items-center">
            <UserPlus className="mr-2 h-6 w-6" />
            Join a Classroom
          </DialogTitle>
          <DialogDescription>
            Enter the join code provided by your class representative to join a classroom.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., BIT25-ABC" 
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
                <p className="text-xs font-mono">BIT25-ABC</p>
                <p className="text-xs font-mono">CSF25-XYZ</p>
              </div>
            </div>
            
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
                {isLoading ? "Joining..." : "Join Classroom"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}