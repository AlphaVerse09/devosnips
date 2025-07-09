
"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  currentSearch: string;
  onSearchChange: (searchTerm: string) => void;
  className?: string;
}

export function SearchBar({ currentSearch, onSearchChange, className }: SearchBarProps) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search snippets (title, description, code)..."
        value={currentSearch}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full"
        aria-label="Search snippets"
      />
    </div>
  );
}
