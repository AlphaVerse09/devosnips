
"use client";

import type { SnippetCategory } from "@/types";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ListFilter, CodeSquare, Palette, FileCode2, FileQuestion, Database, FileText, LayoutGrid, Type, Code } from "lucide-react";

interface MainCategoryNavProps {
  activeMainCategory: string; // 'All' or SnippetCategory
  onSelectMainCategory: (category: string) => void;
}

const mainCategoriesList: Array<{ name: SnippetCategory | "All"; icon: React.ElementType }> = [
  { name: "All", icon: ListFilter },
  { name: "HTML", icon: CodeSquare },
  { name: "CSS", icon: Palette },
  { name: "JavaScript", icon: FileCode2 },
  { name: "React", icon: LayoutGrid },
  { name: "TypeScript", icon: Type },
  { name: "Python", icon: FileText },
  { name: "C#", icon: Code },
  { name: "SQL", icon: Database },
  { name: "Other", icon: FileQuestion },
];

export function MainCategoryNav({ activeMainCategory, onSelectMainCategory }: MainCategoryNavProps) {
  return (
    <SidebarMenu>
      {mainCategoriesList.map(({ name, icon: Icon }) => (
        <SidebarMenuItem key={name}>
          <SidebarMenuButton
            onClick={() => onSelectMainCategory(name)}
            isActive={activeMainCategory === name}
            tooltip={name}
          >
            <Icon />
            <span>{name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

