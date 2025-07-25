 
import Link from 'next/link';
import { PlusCircle, LogOut } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AppHeaderProps {
  onAddSnippet: () => void;
  onSignOut?: () => void;
  userEmail?: string | null;
}

export function AppHeader({ onAddSnippet, onSignOut, userEmail }: AppHeaderProps) {
  const getInitials = (email?: string | null) => {
    if (!email) return "?";
    const parts = email.split("@")[0].split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length -1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <SidebarTrigger className="mr-2 md:hidden" />
        <Link href="/" className="mr-auto flex items-center space-x-2">
          <span className="font-bold font-headline text-xl">DevoSnips</span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          {userEmail && (
            <>
              <Button onClick={onAddSnippet} variant="outline" size="sm" className="hidden sm:inline-flex">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Snippet
              </Button>
              <Button onClick={onAddSnippet} variant="ghost" size="icon" className="sm:hidden">
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">Add Snippet</span>
              </Button>
            </>
          )}
          <ThemeToggleButton />
          {userEmail && onSignOut && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="/user-avatar.png" alt={userEmail} /> */}
                    <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Signed in as</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}

    