"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ApiDocument } from "@/lib/api";
import { documents as documentsApi } from "@/lib/api";
import {
  FileText,
  FileVideo,
  FileSpreadsheet,
  Calendar,
  BookOpen,
  File,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  document: ApiDocument;
}

const docTypeLabels: Record<ApiDocument["document_type"], string> = {
  lecture_notes: "Lecture Notes",
  past_papers: "Past Papers",
  revision_materials: "Revision",
  exam_timetable: "Exam Timetable",
  lecture_timetable: "Timetable",
  other: "Other",
};

function getIcon(type: ApiDocument["document_type"]) {
  switch (type) {
    case "lecture_notes":
      return <BookOpen className="h-6 w-6 text-blue-500" />;
    case "past_papers":
      return <FileText className="h-6 w-6 text-red-500" />;
    case "revision_materials":
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    case "exam_timetable":
    case "lecture_timetable":
      return <Calendar className="h-6 w-6 text-orange-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const downloadUrl = documentsApi.download(document.id);
  const displayDate = document.created_at
    ? new Date(document.created_at).toLocaleDateString()
    : "—";

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {getIcon(document.document_type)}
          <Badge variant="outline" className="text-xs capitalize">
            {docTypeLabels[document.document_type]}
          </Badge>
        </div>
        <CardTitle className="text-base leading-tight font-headline line-clamp-2" title={document.title}>
          {document.title}
        </CardTitle>
        <CardDescription className="text-xs space-y-0.5">
          <span className="block text-muted-foreground truncate">{document.file_name}</span>
          <span>
            {displayDate}
            {document.file_size ? ` · ${formatBytes(document.file_size)}` : ""}
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full" variant="default">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" /> Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
