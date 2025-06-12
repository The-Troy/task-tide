
"use client";

import type { DocumentFile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileQuestion } from "lucide-react";
import Image from "next/image";

interface PdfViewerProps {
  document: DocumentFile | null | undefined;
}

export function PdfViewer({ document }: PdfViewerProps) {
  if (!document) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-6 w-6" /> Document Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>The document you are looking for could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  if (document.type !== 'pdf') {
    return (
       <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileQuestion className="mr-2 h-6 w-6 text-primary" /> 
            Unsupported Document Type
          </CardTitle>
          <CardDescription>
            This viewer currently only supports PDF files. You are trying to view a '{document.type}' file named '{document.name}'.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Image 
            priority
            src="https://placehold.co/600x400.png" // Placeholder for non-PDF document
            alt="Document placeholder"
            width={600}
            height={400}
            className="rounded-md shadow-md mx-auto"
            data-ai-hint="document file"
          />
          <p className="mt-4 text-muted-foreground">
            Please download the file to view it with an appropriate application.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Use a publicly accessible PDF for testing. In a real app, this URL would come from `document.url`.
  // const pdfUrl = document.url; // This would be the actual document URL
  const displayUrl = document.url.startsWith('http') ? document.url : `/placeholder-document.pdf`; // Fallback for local paths

  return (
    <div className="w-full h-[calc(100vh-10rem)] bg-muted rounded-lg shadow-inner overflow-hidden">
      <iframe
        src={displayUrl}
        title={document.name}
        width="100%"
        height="100%"
        className="border-0"
        allowFullScreen
      />
    </div>
  );
}
