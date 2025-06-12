
import { getUnitsBySemester, getSemesterById } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, LibraryBig, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SemesterUnitsPageProps {
  params: {
    semester: string;
  };
}

export default async function SemesterUnitsPage({ params }: SemesterUnitsPageProps) {
  const semesterId = params.semester;
  const semester = getSemesterById(semesterId);
  const units = getUnitsBySemester(semesterId);

  if (!semester) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold text-destructive">Semester Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested semester does not exist.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/documents">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back to Semesters
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <header className="mb-8">
        <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/documents">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Semesters
            </Link>
        </Button>
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <LibraryBig className="mr-3 h-10 w-10" /> {semester.name} Units
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse units available in {semester.name}. Select a unit to view its documents.
        </p>
      </header>

      {units.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <Link href={`/documents/${semester.id}/${unit.id}`} key={unit.id} className="block">
              <Card className="h-full hover:shadow-xl hover:border-primary transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline text-primary">{unit.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                   <Badge variant="secondary">{unit.id.toUpperCase()}</Badge>
                  <Button variant="ghost" size="icon" aria-label={`View ${unit.name}`}>
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
            <p className="text-xl text-muted-foreground">No units found for {semester.name}.</p>
            <p className="mt-2">Please check back later or contact an administrator.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const semesters = getSemesters();
  return semesters.map(semester => ({ semester: semester.id }));
}
