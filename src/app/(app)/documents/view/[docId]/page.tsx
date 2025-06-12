
import { getDocumentById, getSemesterById, getUnitById } from "@/lib/data";
import { PdfViewer } from "@/components/PdfViewer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentViewPageProps {
  params: {
    docId: string;
  };
}

export default async function DocumentViewPage({ params }: DocumentViewPageProps) {
  const document = getDocumentById(params.docId);

  if (!document) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold text-destructive">Document Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested document does not exist.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/documents">
             <ArrowLeft className="mr-2 h-4 w-4" /> Go back to Documents
          </Link>
        </Button>
      </div>
    );
  }

  const semester = getSemesterById(document.semesterId);
  const unit = getUnitById(document.unitId);

  return (
    <div className="container mx-auto py-2 flex flex-col h-full">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button asChild variant="outline" size="sm" className="mb-2">
              <Link href={`/documents/${document.semesterId}/${document.unitId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to {unit?.name || 'Unit'} Documents
              </Link>
            </Button>
            <h1 className="text-3xl font-bold font-headline text-primary">{document.name}</h1>
            <div className="text-sm text-muted-foreground mt-1 space-x-2">
              {semester && <Badge variant="secondary">{semester.name}</Badge>}
              {unit && <Badge variant="secondary">{unit.name}</Badge>}
              <Badge variant="outline" className="capitalize">{document.type}</Badge>
            </div>
          </div>
          {document.type !== 'link' && (
            <Button asChild variant="default">
              <a href={document.url} download={document.name} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download
              </a>
            </Button>
          )}
        </div>
      </header>
      
      <div className="flex-grow">
        <PdfViewer document={document} />
      </div>
    </div>
  );
}

// If documents are dynamic, remove or adjust generateStaticParams
export async function generateStaticParams() {
  const documents = (await import("@/lib/data")).documents; // Ensure data is loaded
  return documents.map(doc => ({ docId: doc.id }));
}
