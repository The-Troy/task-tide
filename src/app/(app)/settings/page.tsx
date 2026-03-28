"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/hooks/useAppContext";
import { useToast } from "@/hooks/use-toast";
import { Settings, UserCircle, Loader2 } from "lucide-react";
import { RoleSwitcher } from "@/components/settings/RoleSwitcher";

export default function SettingsPage() {
  const { currentUser, updateProfile } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleSaveChanges = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await updateProfile(name.trim());
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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

      {/* Role Switcher */}
      <RoleSwitcher />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center text-primary">
            <UserCircle className="mr-2 h-6 w-6" /> Profile Information
          </CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <UserCircle className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button variant="outline" disabled>Change Avatar</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={currentUser.email}
                className="mt-1"
                readOnly
              />
            </div>
          </div>
          <Button
            onClick={handleSaveChanges}
            disabled={isSaving || !name.trim() || name.trim() === currentUser.name}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Profile Changes"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
