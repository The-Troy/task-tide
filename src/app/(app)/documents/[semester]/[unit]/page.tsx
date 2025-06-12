
import { getDocumentsByUnit, getSemesterById, getUnitById } from "@/lib/data";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen } from "lucide-react";

interface UnitDocumentsPageProps {
  params: {
    semester: string;
    unit: string;
  };
}

export default async function UnitDocumentsPage({ params }: UnitDocumentsPageProps) {
  const semesterId = params.semester;
  const unitId = params.unit;
  
  const semester = getSemesterById(semesterId);
  const unit = getUnitById(unitId);
  const documents = getDocumentsByUnit(semesterId, unitId);

  if (!semester || !unit) {
     return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold text-destructive">Unit or Semester Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested unit or semester does not exist.</p>
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
            <Link href={`/documents/${semesterId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to {semester.name} Units
            </Link>
        </Button>
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
            <FolderOpen className="mr-3 h-10 w-10" /> {unit.name}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Documents for {unit.name} in {semester.name}.
        </p>
      </header>

      {documents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-xl text-muted-foreground">No documents found for this unit.</p>
            <p className="mt-2">Check back soon or upload new documents if you are a class representative.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const semesters = getSemesters();
  const paths = [];
  for (const semester of semesters) {
    const units = getUnitsBySemester(semester.id);
    for (const unit of units) {
      paths.push({ semester: semester.id, unit: unit.id });
    }
  }
  return paths;
}
