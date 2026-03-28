"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { units as unitsApi, documents as documentsApi, type ApiUnit } from "@/lib/api";
import { Loader2, Upload } from "lucide-react";

function AddDocumentForm() {
  const { currentUser } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const preselectedUnitId = searchParams.get("unitId");

  const [allUnits, setAllUnits] = useState<ApiUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(preselectedUnitId ?? "");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);

  useEffect(() => {
    unitsApi
      .list()
      .then(({ units }) => setAllUnits(units))
      .catch(() => setAllUnits([]))
      .finally(() => setIsLoadingUnits(false));
  }, []);

  if (!currentUser || (currentUser.role !== "class_rep" && currentUser.role !== "lecturer")) {
    return (
      <div className="flex-1 flex-col p-6 bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-muted-foreground">
            Only class reps and lecturers can upload documents.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUnitId || !file || !title || !documentType) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("document_type", documentType);
      formData.append("file", file);

      await documentsApi.upload(parseInt(selectedUnitId, 10), formData);

      toast({ title: "Document Uploaded!", description: `"${title}" has been uploaded successfully.` });
      router.back();
    } catch (err: unknown) {
      toast({
        title: "Upload Failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex-col p-6 bg-background max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Upload Document</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit selector */}
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select
            value={selectedUnitId}
            onValueChange={setSelectedUnitId}
            required
            disabled={isLoadingUnits}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingUnits ? "Loading units…" : "Select a unit"} />
            </SelectTrigger>
            <SelectContent>
              {allUnits.map((unit) => (
                <SelectItem key={unit.id} value={String(unit.id)}>
                  {unit.name} {unit.unit_code ? `(${unit.unit_code})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Lecture 3 Notes"
            required
          />
        </div>

        {/* Document type */}
        <div className="space-y-2">
          <Label htmlFor="type">Document Type</Label>
          <Select value={documentType} onValueChange={setDocumentType} required>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lecture_notes">Lecture Notes</SelectItem>
              <SelectItem value="past_papers">Past Papers</SelectItem>
              <SelectItem value="revision_materials">Revision Materials</SelectItem>
              <SelectItem value="exam_timetable">Exam Timetable</SelectItem>
              <SelectItem value="lecture_timetable">Lecture Timetable</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* File upload */}
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
          />
          <p className="text-sm text-muted-foreground">
            Supported: PDF, DOCX, PPT, images (max 20MB)
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" /> Upload Document</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AddDocumentPage() {
  return (
    <Suspense>
      <AddDocumentForm />
    </Suspense>
  );
}
