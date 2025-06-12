
import { getSemesters } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, BookCopy } from "lucide-react";

export default async function DocumentsPage() {
  const semesters = getSemesters();

  return (
    <div className="container mx-auto py-2">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <BookCopy className="mr-3 h-10 w-10" /> Document Browser
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Select a semester to view its units and documents.
        </p>
      </header>

      {semesters.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {semesters.map((semester) => (
            <Link href={`/documents/${semester.id}`} key={semester.id} className="block">
              <Card className="h-full hover:shadow-xl hover:border-primary transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline text-primary">{semester.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <p className="text-muted-foreground">View units & documents</p>
                  <Button variant="ghost" size="icon" aria-label={`View ${semester.name}`}>
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-xl text-muted-foreground">No semesters found.</p>
            <p className="mt-2">Please check back later or contact an administrator.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
