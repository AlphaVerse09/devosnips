
"use client";

import type { SnippetCategory } from "@/types";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ListFilter, CodeSquare, Palette, FileCode2, FileQuestion, Database, FileText, Type, Atom, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const CSharpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M11 15.5L9.5 18H8l2-3.5-2-3.5h1.5L11 11.5l1.5-3.5h1.5l-2 3.5 2 3.5h-1.5L12.5 14l-1.5 1.5zM15 11h-1v1h1v-1zm0 2h-1v1h1v-1z" fill="currentColor"/>
        <rect x="5.5" y="5.5" width="13" height="13" rx="1" stroke="currentColor"/>
    </svg>
);

const JavaIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M12 3c-4.42 0-8 3.58-8 8h2c0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.42-3.58-8-8-8z" fill="currentColor" fillOpacity="0.5"/>
        <path d="M4 11h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" fill="currentColor"/>
        <path d="M18 19h2v2h-2v-2z" fill="currentColor"/>
    </svg>
);

const GoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M12 7v10m-5-5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 14.5c0 1.933-1.343 3.5-3 3.5s-3-1.567-3-3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
);

const PHPIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <ellipse cx="12" cy="12" rx="10" ry="7" fill="currentColor" fillOpacity="0.2"/>
        <path d="M8.5 9.5H7v5h1.5c1.38 0 2.5-1.12 2.5-2.5S9.88 9.5 8.5 9.5zm0 3H8.5v-1.5h.0v0c.552 0 1 .448 1 1s-.448 1-1 1zM13 9.5h-2v5h2v-1.5h-1v-1h1V9.5zM16.5 9.5h-2v5h2v-1.5h-1v-1h1V9.5z" fill="currentColor"/>
    </svg>
);

const CppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M8.5 7A3.5 3.5 0 005 10.5v3A3.5 3.5 0 008.5 17h1a3.5 3.5 0 003.5-3.5v-3A3.5 3.5 0 009.5 7h-1zm0 2h1a1.5 1.5 0 011.5 1.5v3A1.5 1.5 0 019.5 15h-1a1.5 1.5 0 01-1.5-1.5v-3A1.5 1.5 0 018.5 9zM16 10h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h2v2z" fill="currentColor"/>
    </svg>
);

const KotlinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M4 20L20 4v16H4zM4 4l16 16V4H4z" fill="currentColor"/>
    </svg>
);

const RustIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M21 12H9m6-4l-3 8m-3-8l3 8m4-6.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM21 12l-2-6h-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const SwiftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M14.58 21.348c-1.2.228-2.556.3-4.068.216-4.536-.264-7.524-2.112-9.288-5.532.744.18 1.488.252 2.22.216 4.14-.204 6.7-1.8 7.632-4.788-.504-2.1-2.028-3.648-4.572-4.5-2.532-.864-4.824-.936-6.876-.252C2.26 1.8 7.338-.282 12.87.582c5.544.864 8.676 4.056 9.468 9.576.228 1.536.144 3.084-.252 4.644-1.332 5.28-5.592 7.02-7.506 6.552zM15.5 1.5c-3.1 1-5.1 3-6 6 .9-3 3-5 6-6z" fill="currentColor"/>
    </svg>
);

const AngularIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M12 2L3 5.5v12L12 22l9-4.5v-12L12 2zm0 2.45L18.5 8H15L12 4.45 9 8H5.5L12 4.45zM12 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1.5l6 3H6l6-3z" fill="currentColor"/>
    </svg>
);

const VueIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M12 2L3 5.5v2L12 13l9-5.5v-2L12 2zM3 10v2l9 5.5 9-5.5v-2l-9 5.5L3 10z" fill="currentColor"/>
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

interface MainCategoryNavProps {
    activeMainCategory: SnippetCategory | "All";
    onSelectMainCategory: (category: SnippetCategory | "All") => void;
}

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
