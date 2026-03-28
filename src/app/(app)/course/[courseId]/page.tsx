"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { courseServers, units as unitsApi, documents as documentsApi, groups as groupsApi } from "@/lib/api";
import type { ApiCourseServer, ApiUnit, ApiDocument, ApiGroup } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [server, setServer] = useState<ApiCourseServer | null>(null);
  const [units, setUnits] = useState<ApiUnit[]>([]);
  const [documents, setDocuments] = useState<{ [unitId: number]: ApiDocument[] }>({});
  const [groups, setGroups] = useState<{ [unitId: number]: ApiGroup[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const loadData = async () => {
      try {
        const { course_server } = await courseServers.get(Number(courseId));
        setServer(course_server);

        const courseUnits = course_server.units ?? [];
        setUnits(courseUnits);

        const docsByUnit: { [unitId: number]: ApiDocument[] } = {};
        const groupsByUnit: { [unitId: number]: ApiGroup[] } = {};

        await Promise.all(
          courseUnits.map(async (unit) => {
            const [docsRes, groupsRes] = await Promise.all([
              documentsApi.list(unit.id),
              groupsApi.list(unit.id),
            ]);
            docsByUnit[unit.id] = docsRes.documents;
            groupsByUnit[unit.id] = groupsRes.groups;
          })
        );

        setDocuments(docsByUnit);
        setGroups(groupsByUnit);
      } catch (error) {
        console.error("Failed to load course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!server) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Course server not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{server.name}</CardTitle>
          {server.description && <CardDescription>{server.description}</CardDescription>}
        </CardHeader>
      </Card>

      {units.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No units yet.</p>
      )}

      {units.map((unit) => (
        <Card key={unit.id}>
          <CardHeader>
            <CardTitle>{unit.name}</CardTitle>
            <CardDescription>{unit.unit_code}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Documents */}
            <div>
              <h3 className="text-base font-semibold mb-3">Documents</h3>
              {(documents[unit.id] ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(documents[unit.id] ?? []).map((doc) => (
                    <Card key={doc.id} className="p-4">
                      <p className="font-medium text-sm truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{doc.document_type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">{doc.file_name}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Groups */}
            <div>
              <h3 className="text-base font-semibold mb-3">Assignment Groups</h3>
              {(groups[unit.id] ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No groups set up yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(groups[unit.id] ?? []).map((group) => (
                    <Card key={group.id} className="p-4">
                      <p className="font-medium text-sm">{group.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.members_count ?? group.members?.length ?? 0} / {group.max_size} members
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
