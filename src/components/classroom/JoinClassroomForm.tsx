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
import { UserPlus, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { courseServers, type ApiCourseServer } from "@/lib/api";

const joinSchema = z.object({
  joinCode: z.string().min(1, "Join code is required"),
});

type JoinFormValues = z.infer<typeof joinSchema>;

interface JoinClassroomFormProps {
  onClassroomJoined?: (server: ApiCourseServer) => void;
}

export function JoinClassroomForm({ onClassroomJoined }: JoinClassroomFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinedServer, setJoinedServer] = useState<ApiCourseServer | null>(null);
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: { joinCode: "" },
  });

  const onSubmit = async (data: JoinFormValues) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const { course_server: server } = await courseServers.join(data.joinCode.toUpperCase());
      setJoinedServer(server);
      onClassroomJoined?.(server);

      toast({
        title: "Successfully Joined!",
        description: `You have joined ${server.name}.`,
      });

      form.reset();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join. Check the code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setJoinedServer(null);
    form.reset();
  };

  const goToServer = () => {
    router.push("/rooms");
    handleClose();
  };

  if (joinedServer) {
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
              You can now access units, documents, and groups.
            </DialogDescription>
          </DialogHeader>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">{joinedServer.name}</CardTitle>
              {joinedServer.description && (
                <CardDescription>{joinedServer.description}</CardDescription>
              )}
            </CardHeader>
          </Card>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleClose}>Close</Button>
            <Button onClick={goToServer}>Go to Classroom</Button>
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
            Enter the join code provided by your class representative.
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
                      placeholder="e.g., BIT-ABC1"
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
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
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