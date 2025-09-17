
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";

export default function DeprecatedSemesterUnitsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary flex items-center justify-center">
            <Info className="mr-3 h-8 w-8" />
            Page Moved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To view units, please go to the main "Rooms" page which now serves as the central browser.
          </p>
          <Button asChild variant="default" className="mt-4">
            <Link href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go to Rooms
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
