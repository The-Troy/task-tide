"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppContext } from "@/hooks/useAppContext";
import { Users, Plus, Server } from "lucide-react";
import Link from "next/link";
import StudyTipCard from "@/components/StudyTipCard";
import { JoinServerForm } from "@/components/server/JoinServerForm";
import { useState, useEffect } from "react";
import { getUserServers } from "@/lib/firestore";
import type { Course } from "@/lib/types";

export default function DashboardPage() {
  const { currentUser } = useAppContext();
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!currentUser) {
    return null;
  }

  useEffect(() => {
    const loadUserCourses = async () => {
      try {
        const courses = await getUserCourses(currentUser.id);
        setUserCourses(courses);
      } catch (error) {
        console.error("Failed to load user courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCourses();
  }, [currentUser.id]);

  const refreshCourses = async () => {
    const courses = await getUserCourses(currentUser.id);
    setUserCourses(courses);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Welcome Banner */}
      <Card className="mb-8 shadow-lg border-none bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            Welcome to TaskTide
          </CardTitle>
          <CardDescription className="text-lg text-purple-200">
            Here's your academic overview. Manage your tasks and resources efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-300">
            You are currently logged in as a{" "}
            <span className="font-semibold capitalize">
              {currentUser.role.replace("_", " ")}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Course Servers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <Server className="mr-3 h-7 w-7 text-primary" />
            Your Courses
          </CardTitle>
          <CardDescription>
            Courses you've created or joined ({userCourses.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {userCourses.map((course) => (
                <Link href={`/course/${course.id}`} key={course.id}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Server className="mr-2 h-5 w-5 text-primary" />
                        {course.name}
                      </CardTitle>
                      <CardDescription>
                        {course.year} • {course.semester}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        {course.members.length} member{course.members.length !== 1 ? "s" : ""}
                        {course.createdBy === currentUser.id && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <StudyTipCard />
    </div>
  );
}
