
"use client";

import type { Snippet } from "@/types";
import { SnippetItem } from "./snippet-item";
import { ShieldAlert } from "lucide-react";

interface SnippetListProps {
  snippets: Snippet[];
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippetId: string) => void;
}

export function SnippetList({ snippets, onEdit, onDelete }: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-1 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-2xl font-bold tracking-tight font-headline">No Snippets Found</h3>
          <p className="text-sm text-muted-foreground">Try adding a new snippet or adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <SnippetItem
          key={snippet.id}
          snippet={snippet}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
