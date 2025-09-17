
// This file is intentionally left blank or can be removed.
// The default app layout from src/app/(app)/layout.tsx will apply.
// No specific intermediate layout is needed for the /rooms/[semesterId] segment.
export default function SemesterSpecificBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
