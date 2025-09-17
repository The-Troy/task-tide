
import { getSemesters, getUnitsBySemester } from "@/lib/data";
import type { Unit, Semester } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BookCopy } from "lucide-react";

// Helper to get a consistent color from a predefined list based on string hash
const colorClasses = [
  "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500",
  "bg-blue-500", "bg-cyan-500", "bg-teal-500", "bg-green-500",
  "bg-lime-500", "bg-yellow-500", "bg-amber-500", "bg-orange-500",
  "bg-rose-500", "bg-fuchsia-500", "bg-violet-500", "bg-sky-500",
  "bg-emerald-500", 
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function getColorClassForUnit(unitName: string): string {
  const hash = hashCode(unitName);
  const index = Math.abs(hash) % colorClasses.length;
  return colorClasses[index];
}


export default async function AllUnitsPage() {
  const semesters = getSemesters();
  const allUnitsWithSemester: Array<Unit & { semesterName: string }> = [];

  semesters.forEach(semester => {
    const unitsInSemester = getUnitsBySemester(semester.id);
    unitsInSemester.forEach(unit => {
      allUnitsWithSemester.push({ ...unit, semesterName: semester.name });
    });
  });

  return (
    <div className="container mx-auto py-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center">
          <BookCopy className="mr-3 h-10 w-10" /> Browse All Units
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore all available units across different semesters.
        </p>
      </header>

      {allUnitsWithSemester.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {allUnitsWithSemester.map((unit) => (
            <Link href={`/rooms/${unit.semesterId}/${unit.id}`} key={unit.id} className="block group">
              <Card className={`h-48 ${getColorClassForUnit(unit.name)} text-white rounded-lg overflow-hidden relative transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl`}>
                <CardHeader className="p-3 relative z-10">
                  <CardTitle className="text-lg font-semibold truncate" title={unit.name}>{unit.name}</CardTitle>
                  <CardDescription className="text-xs text-white/80 truncate" title={unit.semesterName}>{unit.semesterName}</CardDescription>
                </CardHeader>
                <div className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 rotate-[25deg] group-hover:rotate-[15deg] transition-transform duration-300">
                   <Image
                    src={`https://placehold.co/100x100.png?text=${encodeURIComponent(unit.name.substring(0,3))}`}
                    alt="" 
                    width={70}
                    height={70}
                    className="rounded shadow-md opacity-70 group-hover:opacity-90"
                    data-ai-hint="abstract pattern"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-xl text-muted-foreground">No units found.</p>
            <p className="mt-2">Please check back later or contact an administrator if you believe this is an error.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
