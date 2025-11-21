"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCourse, getUnitsForCourse, getDocumentsForUnit, getGroupsForUnit } from "@/lib/firestore";
import type { Course, Unit, DocumentFile, AssignmentGroup } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { GroupCard } from "@/components/groups/GroupCard";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [documents, setDocuments] = useState<{ [unitId: string]: DocumentFile[] }>({});
  const [groups, setGroups] = useState<{ [unitId: string]: AssignmentGroup[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const loadCourseData = async () => {
      try {
        const courseData = await getCourse(courseId as string);
        setCourse(courseData);

        if (courseData) {
          const courseUnits = await getUnitsForCourse(courseData.id);
          setUnits(courseUnits);

          const documentsByUnit: { [unitId: string]: DocumentFile[] } = {};
          const groupsByUnit: { [unitId: string]: AssignmentGroup[] } = {};

          for (const unit of courseUnits) {
            const unitDocuments = await getDocumentsForUnit(unit.id);
            documentsByUnit[unit.id] = unitDocuments;

            const unitGroups = await getGroupsForUnit(unit.id);
            groupsByUnit[unit.id] = unitGroups;
          }

          setDocuments(documentsByUnit);
          setGroups(groupsByUnit);
        }
      } catch (error) {
        console.error("Failed to load course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{course.name}</CardTitle>
          <CardDescription>
            {course.year} • {course.semester}
          </CardDescription>
        </CardHeader>
      </Card>

      {units.map((unit) => (
        <Card key={unit.id} className="mb-8">
          <CardHeader>
            <CardTitle>{unit.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documents[unit.id]?.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Group Work</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups[unit.id]?.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
