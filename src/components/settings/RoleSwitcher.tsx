
"use client";

import { useAppContext } from "@/hooks/useAppContext";
import type { UserRole } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useAppContext();

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as UserRole);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center text-primary">
            <UserCog className="mr-2 h-6 w-6"/>
            Switch Role (Demo)
        </CardTitle>
        <CardDescription>
          Change your role to see different application features. This is for demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={role}
          onValueChange={handleRoleChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="student" id="role-student" />
            <Label htmlFor="role-student" className="text-base font-medium cursor-pointer">
              Student
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="class_representative" id="role-class-rep" />
            <Label htmlFor="role-class-rep" className="text-base font-medium cursor-pointer">
              Class Representative
            </Label>
          </div>
        </RadioGroup>
        <p className="mt-4 text-sm text-muted-foreground">
          Current Role: <span className="font-semibold capitalize">{role.replace('_', ' ')}</span>
        </p>
      </CardContent>
    </Card>
  );
}
