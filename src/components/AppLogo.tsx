
import { BookMarked } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
      <BookMarked className="h-7 w-7" />
      <span className="font-headline">TaskTide</span>
    </Link>
  );
}

export function AppLogoSidebar() {
 return (
    <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary group-data-[collapsible=icon]:justify-center">
      <BookMarked className="h-7 w-7" />
      <span className="font-headline group-data-[collapsible=icon]:hidden">TaskTide</span>
    </Link>
  );
}
