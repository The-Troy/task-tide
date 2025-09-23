"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/hooks/useAppContext";
import { LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = login(email, password);
      
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'student' | 'class_representative') => {
    setIsLoading(true);
    
    // Demo credentials
    const demoCredentials = {
      student: { email: "alex.student@example.com", password: "demo123" },
      class_representative: { email: "casey.rep@example.com", password: "demo123" }
    };
    
    const { email: demoEmail, password: demoPassword } = demoCredentials[role];
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    setTimeout(() => {
      login(demoEmail, demoPassword);
      toast({
        title: `Logged in as ${role.replace('_', ' ')}`,
        description: "Welcome to TaskTide!",
      });
      router.push("/dashboard");
    }, 500);
  };

  return (
    <>
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your TaskTide account to continue
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>

      <Separator className="my-6" />

      <div className="space-y-3">
        <p className="text-sm text-center text-muted-foreground">
          Try the demo:
        </p>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            onClick={() => handleDemoLogin('student')}
            disabled={isLoading}
            className="w-full"
          >
            Demo as Student
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDemoLogin('class_representative')}
            disabled={isLoading}
            className="w-full"
          >
            Demo as Class Rep
          </Button>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}