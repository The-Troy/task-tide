
"use client";

import type { NotificationMessage } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellRing, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: NotificationMessage;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Card className={cn("transition-all duration-300", notification.read ? "bg-muted/50 opacity-70" : "bg-card hover:shadow-md")}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-headline flex items-center">
                {!notification.read && <BellRing className="mr-2 h-5 w-5 text-primary" />}
                {notification.title}
            </CardTitle>
            <Badge variant={notification.read ? "secondary" : "default"} className="text-xs whitespace-nowrap">
                {notification.read ? "Read" : "Unread"}
            </Badge>
        </div>
        <CardDescription className="text-xs">{timeAgo(notification.timestamp)}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-foreground">{notification.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {notification.link && (
          <Button variant="outline" size="sm" asChild>
            <Link href={notification.link}>
              View Details <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        )}
        {!notification.read && (
          <Button variant="default" size="sm" onClick={() => onMarkAsRead(notification.id)}>
            <Check className="mr-2 h-4 w-4" /> Mark as Read
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
