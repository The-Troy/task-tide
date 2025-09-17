
// This page is no longer needed as its functionality to display units
// for a specific semester has been merged into the main /rooms page
// which now shows all units in a Spotify-style browser.
//
// If a user navigates to /rooms/[semesterId], they should ideally be
// redirected to /rooms or this page could show a message to select
// a unit from the main /rooms browser. For now, removing its content
// as part of the structural simplification.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";

export default function SemesterSpecificCatchallPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary flex items-center justify-center">
            <Info className="mr-3 h-8 w-8" />
            Browse Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please select a specific unit from the main "Rooms" browser.
          </p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Rooms
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
