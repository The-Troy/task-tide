"use client";

import { useState } from "react";
import { courseServers, type ApiCourseServer } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Server, Plus } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (server: ApiCourseServer) => void;
}

export default function CreateServerDialog({ open, onOpenChange, onCreated }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            const { course_server } = await courseServers.create({
                name: name.trim(),
                description: description.trim() || undefined,
            });
            toast({
                title: "Server created! 🎉",
                description: `"${course_server.name}" is ready. Share the code: ${course_server.code}`,
            });
            onCreated(course_server);
            setName("");
            setDescription("");
            onOpenChange(false);
        } catch (err) {
            toast({
                title: "Failed to create server",
                description: err instanceof Error ? err.message : "Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-primary" />
                        Create Course Server
                    </DialogTitle>
                    <DialogDescription>
                        Set up a new course server for your class. A unique join code will be generated automatically.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="server-name">Server Name *</Label>
                        <Input
                            id="server-name"
                            placeholder="e.g. Computer Science Year 3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="server-desc">Description (optional)</Label>
                        <Textarea
                            id="server-desc"
                            placeholder="Brief description of this course server…"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !name.trim()}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    Creating…
                                </span>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Server
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
