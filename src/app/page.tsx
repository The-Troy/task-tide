
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
          <BookMarked className="h-8 w-8" />
          <span className="font-headline">TaskTide</span>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            Go to App
            <LogIn className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
              <BookMarked className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-headline text-primary">Welcome to TaskTide</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Your all-in-one platform for academic document management and group collaboration.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Image 
              src="https://placehold.co/600x300.png" 
              alt="TaskTide illustration" 
              width={600} 
              height={300}
              className="rounded-lg shadow-md"
              data-ai-hint="team collaboration" 
            />
            <p className="text-center text-foreground">
              TaskTide helps students and class representatives streamline their academic workflow. 
              Access documents by semester and unit, view PDFs in-app, manage assignment groups, 
              and stay updated with notifications.
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/dashboard">
                Get Started
                <LogIn className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      <footer className="text-center p-6 text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TaskTide. All rights reserved.</p>
      </footer>
    </div>
  );
}
