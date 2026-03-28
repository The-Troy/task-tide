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
import { useToast } from "@/hooks/use-toast";
import { LogIn, Hash } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onJoined: (server: ApiCourseServer) => void;
}

export default function JoinServerDialog({ open, onOpenChange, onJoined }: Props) {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsLoading(true);
        try {
            const { course_server } = await courseServers.join(code.trim().toUpperCase());
            toast({
                title: "Joined! 🎉",
                description: `You've joined "${course_server.name}".`,
            });
            onJoined(course_server);
            setCode("");
            onOpenChange(false);
        } catch (err) {
            toast({
                title: "Failed to join",
                description: err instanceof Error ? err.message : "Invalid code. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5 text-primary" />
                        Join a Course Server
                    </DialogTitle>
                    <DialogDescription>
                        Enter the join code provided by your class representative.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="join-code">Join Code</Label>
                        <Input
                            id="join-code"
                            placeholder="e.g. CS3-AB12"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            required
                            disabled={isLoading}
                            className="font-mono uppercase tracking-widest text-center text-lg"
                            maxLength={12}
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
                        <Button type="submit" disabled={isLoading || !code.trim()}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    Joining…
                                </span>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Join Server
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
