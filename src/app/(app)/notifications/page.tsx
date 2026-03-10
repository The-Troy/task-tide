"use client";

import { BellRing, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <BellRing className="mr-3 h-10 w-10" /> Notifications
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Stay updated with the latest activities and announcements.
        </p>
      </header>

      <Card>
        <CardContent className="py-14 text-center space-y-4">
          <Mail className="mx-auto h-16 w-16 text-primary/50" />
          <h2 className="text-xl font-semibold">Notifications are sent by email</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            TaskTide notifies you automatically via email whenever:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 max-w-xs mx-auto text-left list-disc list-inside">
            <li>A new document is uploaded to one of your units</li>
            <li>You receive a lecturer invitation</li>
            <li>Real-time chat messages arrive (WebSocket)</li>
          </ul>
          <p className="text-xs text-muted-foreground pt-2">
            Check your email inbox for the latest updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
