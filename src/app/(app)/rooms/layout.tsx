
// This file is intentionally left blank or can be removed.
// The default app layout from src/app/(app)/layout.tsx will apply to /rooms and its children.
// No specific layout is needed for the /rooms segment if we are adopting the Spotify-style browse page.
export default function RoomsBaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
