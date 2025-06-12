
"use client";

import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead, notifications as staticNotifications } from "@/lib/data";
import type { NotificationMessage } from "@/lib/types";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellOff, BellRing, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  
  useEffect(() => {
    // Initial load and ensure it's sorted
    setNotifications([...staticNotifications].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
    setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto py-2">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
                <BellRing className="mr-3 h-10 w-10"/> Notifications
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
            Stay updated with the latest activities and announcements.
            </p>
        </div>
        {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
                <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
        )}
      </header>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onMarkAsRead={handleMarkAsRead} 
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <BellOff className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No notifications yet.</p>
            <p className="mt-2">We'll let you know when there's something new.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
