"use client";

import { useEffect, useState, useCallback } from "react";
import { BellRing, CheckCircle, XCircle, Loader2, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { invitations as invitationsApi, type ApiInvitation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function NotificationsPage() {
  const [items, setItems] = useState<ApiInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const load = useCallback(() => {
    setIsLoading(true);
    invitationsApi
      .list()
      .then(({ invitations }) => setItems(invitations))
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAccept = async (inv: ApiInvitation) => {
    setBusy((b) => ({ ...b, [inv.id]: true }));
    try {
      await invitationsApi.accept(inv.token);
      toast({ title: "Invitation accepted", description: `You joined ${inv.unit?.name ?? "the unit"}.` });
      load();
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not accept invitation.",
        variant: "destructive",
      });
    } finally {
      setBusy((b) => ({ ...b, [inv.id]: false }));
    }
  };

  const handleReject = async (inv: ApiInvitation) => {
    setBusy((b) => ({ ...b, [inv.id]: true }));
    try {
      await invitationsApi.reject(inv.token);
      toast({ title: "Invitation declined" });
      load();
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not decline invitation.",
        variant: "destructive",
      });
    } finally {
      setBusy((b) => ({ ...b, [inv.id]: false }));
    }
  };

  const pending = items.filter((i) => i.status === "pending");
  const past = items.filter((i) => i.status !== "pending");

  return (
    <div className="container mx-auto py-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <BellRing className="mr-3 h-10 w-10" /> Notifications
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Pending invitations and recent activity.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending invitations */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Pending Invitations
              {pending.length > 0 && (
                <Badge variant="default">{pending.length}</Badge>
              )}
            </h2>
            {pending.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center space-y-3">
                  <Mail className="mx-auto h-12 w-12 text-primary/40" />
                  <p className="text-muted-foreground">No pending invitations.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pending.map((inv) => (
                  <InvitationCard
                    key={inv.id}
                    invitation={inv}
                    isBusy={!!busy[inv.id]}
                    onAccept={() => handleAccept(inv)}
                    onReject={() => handleReject(inv)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Past invitations */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Past Invitations</h2>
              <div className="space-y-3">
                {past.map((inv) => (
                  <InvitationCard key={inv.id} invitation={inv} isBusy={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function InvitationCard({
  invitation,
  isBusy,
  onAccept,
  onReject,
}: {
  invitation: ApiInvitation;
  isBusy: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  const isPending = invitation.status === "pending";
  const expiresAt = new Date(invitation.expires_at).toLocaleDateString();

  const statusBadge = {
    pending: <Badge variant="default">Pending</Badge>,
    accepted: <Badge className="bg-green-600 text-white">Accepted</Badge>,
    rejected: <Badge variant="secondary">Declined</Badge>,
    expired: <Badge variant="destructive">Expired</Badge>,
  }[invitation.status];

  return (
    <Card className={isPending ? "" : "opacity-60"}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">
              Invitation to join <span className="text-primary">{invitation.unit?.name ?? "a unit"}</span>
            </CardTitle>
            <CardDescription className="mt-0.5">
              {invitation.inviter
                ? `Invited by ${invitation.inviter.name}`
                : "Invited by your class representative"}
            </CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          {isPending
            ? `Expires ${expiresAt}`
            : `Updated ${new Date(invitation.created_at).toLocaleDateString()}`}
        </p>
        {isPending && onAccept && onReject && (
          <div className="flex gap-2">
            <Button size="sm" onClick={onAccept} disabled={isBusy} className="gap-1.5">
              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={onReject} disabled={isBusy} className="gap-1.5">
              <XCircle className="h-4 w-4" />
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
