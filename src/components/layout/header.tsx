
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
import { SidebarTrigger } from '@/components/ui/sidebar'; // Import SidebarTrigger

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
      <div className="flex h-16 items-center px-4"> {/* Changed px-8 to px-4 */}
        <SidebarTrigger className="mr-2 md:hidden" /> {/* Sidebar trigger for mobile */}
        <Link href="/" className="mr-auto flex items-center space-x-2">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
            <g className="text-foreground">
              <path d="M15.5858 12.0284L15.6138 12L15.5858 11.9716L19.5 8.05736C19.7929 7.76447 20.2678 7.76447 20.5607 8.05736C20.8536 8.35025 20.8536 8.82513 20.5607 9.11802L16.6464 13.0322L15.5858 12.0284Z" fill="currentColor"/>
              <path d="M15.5858 11.9716L16.6138 13L20.5607 9.11802C20.8536 8.82513 20.8536 8.35025 20.5607 8.05736C20.2678 7.76447 19.7929 7.76447 19.5 8.05736L15.5858 11.9716Z" fill="currentColor"/>
              <path d="M12 12L15.5523 15.5523C16.9205 16.9205 16.9205 19.0795 15.5523 20.4477C14.184 21.816 12.025 21.816 10.6567 20.4477C9.28843 19.0795 9.28843 16.9205 10.6567 15.5523L12 14.209" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 12L15.5523 8.44772C16.9205 7.07949 16.9205 4.92051 15.5523 3.55228C14.184 2.18406 12.025 2.18406 10.6567 3.55228C9.28843 4.92051 9.28843 7.07949 10.6567 8.44772L12 9.791" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
            <rect x="2" y="4" width="16" height="16" rx="4" className="fill-primary"/>
            <path d="M7 10L5 12L7 14" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 10L13 12L11 14" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold font-headline text-xl">DevoSnips</span>
        </Link>
        <nav className="flex items-center space-x-2">
          {userEmail && ( 
            <Button onClick={onAddSnippet} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Snippet
            </Button>
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
