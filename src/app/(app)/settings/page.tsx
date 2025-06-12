
"use client";

import { RoleSwitcher } from "@/components/settings/RoleSwitcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/hooks/useAppContext";
import { Settings, UserCircle, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const { currentUser } = useAppContext();

  return (
    <div className="container mx-auto py-2 space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <Settings className="mr-3 h-10 w-10" /> Settings
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your account preferences and application settings.
        </p>
      </header>

      <RoleSwitcher />

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center text-primary">
             <UserCircle className="mr-2 h-6 w-6"/> Profile Information
          </CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Image 
              src={currentUser.avatarUrl || "https://placehold.co/100x100.png"} 
              alt={currentUser.name} 
              width={80} 
              height={80} 
              className="rounded-full"
              data-ai-hint="profile avatar"
            />
            <Button variant="outline">Change Avatar</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={currentUser.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={currentUser.email} className="mt-1" readOnly/>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Profile Changes</Button>
        </CardContent>
      </Card>
      
      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center text-primary">
             <ShieldAlert className="mr-2 h-6 w-6"/> Account Security
          </CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" className="mt-1" />
            </div>
             <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" className="mt-1" />
            </div>
          <Button variant="destructive">Change Password</Button>
        </CardContent>
      </Card>

    </div>
  );
}
