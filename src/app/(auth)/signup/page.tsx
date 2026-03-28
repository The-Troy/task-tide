"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/hooks/useAppContext";
import { UserPlus, Eye, EyeOff, Users, Crown } from "lucide-react";
import Link from "next/link";
import type { UserRole } from "@/contexts/AppContext";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast({
        title: "Account created!",
        description: `Welcome to TaskTide! Signed in as ${formData.role === 'class_rep' ? 'Class Representative' : 'Student'}.`,
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({
        title: "Registration failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <CardHeader className="text-center pb-6 px-0">
        <CardTitle className="text-2xl font-headline">Create Account</CardTitle>
        <CardDescription>
          Join TaskTide to start collaborating on your academic projects
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            disabled={isLoading}
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password (min 6 chars)"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Role selector */}
        <div className="space-y-3">
          <Label>Account Type</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={(value) => handleInputChange("role", value)}
            disabled={isLoading}
            className="space-y-2"
          >
            <label
              htmlFor="role-student"
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${formData.role === 'student'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
                }`}
            >
              <RadioGroupItem value="student" id="role-student" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  Student
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Join course servers using a join code, access documents and group chats
                </p>
              </div>
            </label>

            <label
              htmlFor="role-classrep"
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${formData.role === 'class_rep'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
                }`}
            >
              <RadioGroupItem value="class_rep" id="role-classrep" className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  Class Representative
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create and manage course servers, add units, share documents
                </p>
              </div>
            </label>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Creating account...
            </span>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </>
          )}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}