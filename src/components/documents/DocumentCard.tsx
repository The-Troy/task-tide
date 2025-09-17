
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DocumentFile } from "@/lib/types";
import { FileText, FileVideo, FileArchive, Link as LinkIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  document: DocumentFile;
}

const getIconForType = (type: DocumentFile['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-6 w-6 text-red-500" />;
    case 'docx':
      return <FileText className="h-6 w-6 text-blue-500" />;
    case 'video':
      return <FileVideo className="h-6 w-6 text-green-500" />;
    case 'link':
        return <LinkIcon className="h-6 w-6 text-orange-500" />;
    default:
      return <FileText className="h-6 w-6 text-gray-500" />;
  }
};

export function DocumentCard({ document }: DocumentCardProps) {
  const isExternalLink = document.type === 'link' && document.url.startsWith('http');
  const viewPath = isExternalLink ? document.url : `/documents/view/${document.id}`;
  
  // Format date directly in the render logic
  const displayDate = document.uploadedAt 
    ? new Date(document.uploadedAt).toLocaleDateString() 
    : "...";

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {getIconForType(document.type)}
          <Badge variant="outline" className="capitalize">{document.type}</Badge>
        </div>
        <CardTitle className="text-lg leading-tight font-headline">{document.name}</CardTitle>
        <CardDescription className="text-xs">
          Uploaded: {displayDate}
          {document.size && ` | Size: ${document.size}`}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full" variant={isExternalLink ? "outline" : "default"}>
          <Link href={viewPath} target={isExternalLink ? "_blank" : "_self"} rel={isExternalLink ? "noopener noreferrer" : ""}>
            {isExternalLink ? "Open Link" : "View Document"}
            {isExternalLink && <ExternalLink className="ml-2 h-4 w-4" />}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
