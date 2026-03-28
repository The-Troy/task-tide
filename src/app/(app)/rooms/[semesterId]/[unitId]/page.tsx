"use client";

import React, { useState, useEffect, useCallback, useRef, use } from 'react';
import {
  units as unitsApi,
  documents as documentsApi,
  groups as groupsApi,
  messages as messagesApi,
  invitations as invitationsApi,
  type ApiUnit,
  type ApiDocument,
  type ApiGroup,
  type ApiMessage,
} from "@/lib/api";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { GroupCard } from "@/components/groups/GroupCard";
import { GroupSetupForm } from "@/components/groups/GroupSetupForm";
import { useAppContext } from "@/hooks/useAppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Users as UsersIcon, AlertCircle, Search,
  Upload, MessageSquare, Send, Loader2, UserPlus, Mail,
} from "lucide-react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UnitRoomPageProps {
  params: Promise<{
    semesterId: string; // actually courseServerId
    unitId: string;
  }>;
}

const DOC_TYPES = [
  { value: "lecture_notes", label: "Lecture Notes" },
  { value: "past_papers", label: "Past Papers" },
  { value: "revision_materials", label: "Revision Materials" },
  { value: "exam_timetable", label: "Exam Timetable" },
  { value: "lecture_timetable", label: "Lecture Timetable" },
  { value: "other", label: "Other" },
] as const;

export default function UnitRoomPage({ params }: UnitRoomPageProps) {
  const { semesterId: _semesterId, unitId: unitIdStr } = use(params);
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const unitId = parseInt(unitIdStr, 10);

  const [unit, setUnit] = useState<ApiUnit | null>(null);
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Messages
  const [msgs, setMsgs] = useState<ApiMessage[]>([]);
  const [msgText, setMsgText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Upload dialog
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<string>("lecture_notes");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Invite dialog
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const loadGroups = useCallback(async () => {
    if (!unitId) return;
    try {
      const res = await groupsApi.list(unitId);
      setGroups(res.groups);
    } catch {
      setGroups([]);
    }
  }, [unitId]);

  const loadMessages = useCallback(async () => {
    if (!unitId) return;
    try {
      const res = await messagesApi.list(unitId);
      setMsgs(res.data);
    } catch {
      // silently ignore polling errors
    }
  }, [unitId]);

  // Initial data load
  useEffect(() => {
    if (!currentUser || !unitId) return;

    setIsLoading(true);
    Promise.all([
      unitsApi.get(unitId),
      documentsApi.list(unitId),
      groupsApi.list(unitId),
      messagesApi.list(unitId),
    ])
      .then(([unitRes, docsRes, groupsRes, msgsRes]) => {
        setUnit(unitRes.unit);
        setDocuments(docsRes.documents);
        setGroups(groupsRes.groups);
        setMsgs(msgsRes.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [currentUser, unitId]);

  // Poll messages every 5 seconds
  useEffect(() => {
    if (!currentUser || !unitId) return;
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [currentUser, unitId, loadMessages]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || isSending) return;
    setIsSending(true);
    try {
      const { data: newMsg } = await messagesApi.send(unitId, msgText.trim());
      setMsgs((prev) => [...prev, newMsg]);
      setMsgText("");
    } catch (err: unknown) {
      toast({
        title: "Failed to send",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim()) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", uploadTitle.trim());
      fd.append("document_type", uploadType);
      fd.append("file", uploadFile);
      const { document: doc } = await documentsApi.upload(unitId, fd);
      setDocuments((prev) => [doc, ...prev]);
      setShowUpload(false);
      setUploadTitle("");
      setUploadFile(null);
      setUploadType("lecture_notes");
      toast({ title: "Document uploaded", description: doc.title });
    } catch (err: unknown) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      await invitationsApi.invite(unitId, inviteEmail.trim());
      setShowInvite(false);
      setInviteEmail("");
      toast({ title: "Invitation sent", description: `Invite sent to ${inviteEmail.trim()}.` });
    } catch (err: unknown) {
      toast({
        title: "Failed to send invitation",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const role = currentUser?.role;

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (notFound || !unit) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-background">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Unit Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          This unit could not be found. It may have been removed or you may not have access.
        </p>
        <Button asChild variant="default" size="lg">
          <Link href="/rooms">
            <ArrowLeft className="mr-2 h-5 w-5" /> Go back to All Rooms
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <header className="mb-4 flex items-center gap-4">
        <Button asChild variant="outline" size="icon" aria-label="Back to all rooms">
          <Link href="/rooms">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-headline text-primary">{unit.name}</h1>
          <p className="text-md text-muted-foreground mt-1">
            {unit.unit_code && <span className="font-mono mr-2">[{unit.unit_code}]</span>}
            {unit.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(role === 'class_rep' || role === 'lecturer') && (
            <Button variant="outline" onClick={() => setShowUpload(true)}>
              <Upload className="mr-2 h-4 w-4" /> Upload Doc
            </Button>
          )}
          {role === 'class_rep' && (
            <Button variant="outline" onClick={() => setShowInvite(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite Lecturer
            </Button>
          )}
        </div>
      </header>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <BookOpen className="mr-3 h-7 w-7 text-primary" />
            Unit Documents
          </CardTitle>
          <CardDescription>
            All learning materials and resources for this unit. ({documents.length} found)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-center">
              No documents uploaded yet for this unit.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Groups Section */}
      <div>
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-headline flex items-center">
            <UsersIcon className="mr-3 h-7 w-7 text-primary" />
            Assignment Groups
          </CardTitle>
          <CardDescription>
            Join or manage groups for assignments in this unit. ({groups.length} total)
          </CardDescription>
        </CardHeader>

        {role === 'class_rep' && (
          <div className="mb-6">
            <GroupSetupForm unitId={unit.id} onGroupsCreated={loadGroups} />
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search groups by name..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onGroupJoinedOrUpdated={loadGroups}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-lg text-muted-foreground">
                No assignment groups found{searchTerm && " matching your search"}.
              </p>
              {role === 'class_rep' && !searchTerm && (
                <p className="mt-2">Use the Auto-Setup form above to create groups for this unit.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Chat / Messages Section */}
      <div>
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-headline flex items-center">
            <MessageSquare className="mr-3 h-7 w-7 text-primary" />
            Unit Chat
          </CardTitle>
          <CardDescription>
            Discuss this unit with your classmates. Messages refresh every 5 seconds.
          </CardDescription>
        </CardHeader>

        <Card>
          {/* Message list */}
          <CardContent className="p-4">
            <div className="h-80 overflow-y-auto space-y-3 pr-2">
              {msgs.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                msgs.map((msg) => {
                  const isOwn = msg.user_id === currentUser?.id;
                  const initials = (msg.user?.name ?? "?").substring(0, 2).toUpperCase();
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                        <span className="text-xs text-muted-foreground mb-0.5">
                          {isOwn ? "You" : (msg.user?.name ?? "Unknown")}
                        </span>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm ${
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>
          </CardContent>

          {/* Send form */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Textarea
                placeholder="Type a message…"
                className="resize-none min-h-[40px] max-h-[120px] flex-1"
                rows={1}
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as unknown as React.FormEvent);
                  }
                }}
                disabled={isSending}
              />
              <Button type="submit" disabled={isSending || !msgText.trim()} size="icon">
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="doc-title">Title</Label>
              <Input
                id="doc-title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Week 3 Lecture Notes"
                required
                disabled={isUploading}
              />
            </div>
            <div>
              <Label htmlFor="doc-type">Document Type</Label>
              <Select value={uploadType} onValueChange={setUploadType} disabled={isUploading}>
                <SelectTrigger id="doc-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="doc-file">File</Label>
              <Input
                id="doc-file"
                type="file"
                className="mt-1"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                required
                disabled={isUploading}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUpload(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !uploadFile || !uploadTitle.trim()}>
                {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</> : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invite Lecturer Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Lecturer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send an invitation to a lecturer's email address. They will receive a link to accept and join this unit.
            </p>
            <div>
              <Label htmlFor="invite-email">Lecturer Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="lecturer@example.com"
                  className="pl-9"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  disabled={isInviting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowInvite(false)} disabled={isInviting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isInviting || !inviteEmail.trim()}>
                {isInviting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
