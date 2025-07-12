
"use client";

import type { SnippetCategory } from "@/types";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ListFilter, CodeSquare, Palette, FileCode2, FileQuestion, Database, FileText, LayoutGrid, Type, Code, ChevronDown, ChevronUp, Atom, Coffee } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const JavaIcon = () => (
    <Coffee />
);

const GoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <text x="2" y="18" fontFamily="monospace" fontSize="18" fill="currentColor">GO</text>
    </svg>
);

const PHPIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <text x="0" y="18" fontFamily="monospace" fontSize="16" fill="currentColor">PHP</text>
    </svg>
);

const CppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
       <text x="2" y="18" fontFamily="monospace" fontSize="18" fill="currentColor">C++</text>
    </svg>
);

const CSharpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <text x="4" y="18" fontFamily="monospace" fontSize="18" fill="currentColor">C#</text>
    </svg>
);


const KotlinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m20.5 20.5-6-6-6-6-6-6h18v18zM4 20.5V4h16.5L4 20.5z" fill="currentColor"/>
    </svg>
);

const RustIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <text x="6" y="18" fontFamily="monospace" fontSize="18" fill="currentColor">R</text>
    </svg>
);

const SwiftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.58 21.348c-1.2.228-2.556.3-4.068.216-4.536-.264-7.524-2.112-9.288-5.532.744.18 1.488.252 2.22.216 4.14-.204 6.7-1.8 7.632-4.788-.504-2.1-2.028-3.648-4.572-4.5-2.532-.864-4.824-.936-6.876-.252C2.26 1.8 7.338-.282 12.87.582c5.544.864 8.676 4.056 9.468 9.576.228 1.536.144 3.084-.252 4.644-1.332 5.28-5.592 7.02-7.506 6.552zM15.5 1.5c-3.1 1-5.1 3-6 6 .9-3 3-5 6-6z" fill="currentColor"/>
    </svg>
);

const AngularIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 3 5.5v12L12 22l9-4.5v-12L12 2zm0 2.45L18.5 8H15L12 4.45 9 8H5.5L12 4.45zM12 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1.5 6 3H6l6-3z" fill="currentColor"/>
    </svg>
);

const VueIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 3 5.5v2L12 13l9-5.5v-2L12 2zM3 10v2l9 5.5 9-5.5v-2l-9 5.5L3 10z" fill="currentColor"/>
    </svg>
);

const mainCategoriesList: Array<{ name: SnippetCategory | "All"; icon: React.ElementType }> = [
  { name: "All", icon: ListFilter },
  { name: "HTML", icon: CodeSquare },
  { name: "CSS", icon: Palette },
  { name: "JavaScript", icon: FileCode2 },
  { name: "React", icon: Atom },
  { name: "TypeScript", icon: Type },
  { name: "Python", icon: FileText },
  { name: "C#", icon: CSharpIcon },
  { name: "SQL", icon: Database },
  { name: "Java", icon: JavaIcon },
  { name: "Go", icon: GoIcon },
  { name: "PHP", icon: PHPIcon },
  { name: "C++", icon: CppIcon },
  { name: "Kotlin", icon: KotlinIcon },
  { name: "Rust", icon: RustIcon },
  { name: "Swift", icon: SwiftIcon },
  { name: "Angular", icon: AngularIcon },
  { name: "Vue", icon: VueIcon },
  { name: "Other", icon: FileQuestion },
];

const INITIAL_VISIBLE_COUNT = 9;

export function MainCategoryNav({ activeMainCategory, onSelectMainCategory }: MainCategoryNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleCategories = isExpanded ? mainCategoriesList : mainCategoriesList.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <>
      <SidebarMenu>
        {visibleCategories.map(({ name, icon: Icon }) => (
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
      {mainCategoriesList.length > INITIAL_VISIBLE_COUNT && (
        <div className="px-4 py-2">
            <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            >
            {isExpanded ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
            {isExpanded ? 'Show Less' : 'Show More'}
            </Button>
        </div>
      )}
    </>
  );
}
