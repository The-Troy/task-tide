
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/hooks/useAppContext";
import { useToast } from "@/hooks/use-toast";
import { Settings, UserCircle, UserCog } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const { currentUser } = useAppContext();
  const { toast } = useToast();

  if (!currentUser) {
    return null;
  }

  const handleSaveChanges = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <Settings className="mr-3 h-10 w-10" /> Settings
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your account preferences and application settings.
        </p>
      </header>

      {/* Role Display */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center text-primary">
            <UserCog className="mr-2 h-6 w-6"/>
            Current Role
          </CardTitle>
          <CardDescription>
            You are currently logged in with the following role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-lg font-semibold capitalize">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {currentUser.role === 'student' 
              ? 'As a student, you can join groups and access documents.'
              : 'As a class representative, you can create and manage groups.'
            }
          </p>
        </CardContent>
      </Card>

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
          <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
