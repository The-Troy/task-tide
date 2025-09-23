"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookMarked } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-primary">
            <BookMarked className="h-8 w-8" />
            <span className="font-headline">TaskTide</span>
          </Link>
          <p className="text-muted-foreground mt-2">
            Academic collaboration made simple
          </p>
        </div>
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}