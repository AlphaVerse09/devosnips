
"use client";

import type { SnippetCategory } from "@/types";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ListFilter, CodeSquare, Palette, FileCode2, FileQuestion, Database, FileText, LayoutGrid, Type, Code, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface MainCategoryNavProps {
  activeMainCategory: string; 
  onSelectMainCategory: (category: string) => void;
}

const JavaIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.333 13.917c.5.583 1.083 1 1.75 1.25s1.333.333 2 .167c.667-.167 1.25-.5 1.75-1s.917-1.083 1.25-1.75c-1.5-.167-2.917-.083-4.25.25-1.083.25-2.083.667-3 1.25V18.5c1.417-1 2.917-1.583 4.5-1.75.167-.833.333-1.667.5-2.5-.5-.417-1-.75-1.5-1zM5 13.75c1.25-1.083 2.583-1.75 4-2 .167-.833.333-1.667.5-2.5-1.5.333-2.917.917-4.25 1.75C5.083 12.167 5 13 5 13.75zm13.167-2.5c.083-.667.083-1.333 0-2-.083-.667-.25-1.25-.5-1.75s-.583-.917-1-1.25-1-.5-1.5-.5-1 .167-1.5.5c-.5.333-.917.75-1.25 1.25.5 1 1.167 1.833 2 2.5.833.667 1.75 1.083 2.75 1.25zM4 9.5a2.5 2.5 0 0 1 1.75-2.417A4.25 4.25 0 0 1 8.5 5.5c1.167 0 2.167.333 3 .917.833.583 1.417 1.333 1.75 2.25.333.917.417 1.833.25 2.75A12.8 12.8 0 0 1 9.5 13c-.833-1-1.417-2.083-1.75-3.25A2.73 2.73 0 0 1 7 9.5c-.333 0-.667-.083-1-.25S5.5 8.75 5.25 8.5C4.583 9 4.167 9.25 4 9.5z" fill="currentColor"/>
    </svg>
);

const GoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 12.25h-1.5v-2h-2v-1.5h2v-2h1.5v2h2v1.5h-2v2zm3.083-4.5a3.8 3.8 0 0 1-1.083.833A4.25 4.25 0 0 1 12 9c-1.167 0-2.167-.333-3-.917-.833-.583-1.5-1.417-2-2.5S6.583 3.5 7.167 2.833a4.08 4.08 0 0 1 3.5-1.166 4.3 4.3 0 0 1 3.083 1.833c.5.833.75 1.75.75 2.75 0 .833-.167 1.583-.5 2.25zM17 17.5a4.239 4.239 0 0 1-4.25 4.25H9.5a5.25 5.25 0 0 1-4-1.75 4.083 4.083 0 0 1-1.5-3.5v-5.5h1.5v5.5c0 1 .333 1.833 1 2.5.667.667 1.417 1 2.25 1H12a2.75 2.75 0 0 0 2.75-2.75V15h1.5v2.5z" fill="currentColor"/>
    </svg>
);

const PHPIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm7.5-3.5a3.5 3.5 0 1 0-7 0h7zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" fill="currentColor"/>
    </svg>
);

const CppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 14.5h-1.5V16h-2v-1.5H9.5v-2h1.5V11h2v1.5h1.5v2zm3 0h-1.5V16h-2v-1.5H15v-2h1.5V11h2v1.5H20v2zM9.5 4A4.5 4.5 0 0 0 5 8.5v7A4.5 4.5 0 0 0 9.5 20h10a4.5 4.5 0 0 0 4.5-4.5v-7A4.5 4.5 0 0 0 19.5 4h-10zM8 8.5a1.5 1.5 0 0 1 1.5-1.5h10a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 8 15.5v-7z" fill="currentColor"/>
    </svg>
);

const KotlinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m20.5 20.5-6-6-6-6-6-6h18v18zM4 20.5V4h16.5L4 20.5z" fill="currentColor"/>
    </svg>
);

const RustIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5 13.25v-2.5h-4.25a.76.76 0 0 0-.75.75v1a.76.76 0 0 0 .75.75h4.25zM17.25 9.5V7H22v2.5h-4.75zM16 19a1 1 0 0 1-.75-1.625L17.5 15h-2.25a1.75 1.75 0 0 1-1.75-1.75v-2.5a1.75 1.75 0 0 1 1.75-1.75h5.5v-1.5H2.5v1.5h6.25v8.25L2.5 19v1.5h20V19h-6.5zM11.75 17V8.75h-2.5V17h2.5z" fill="currentColor"/>
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
  { name: "React", icon: LayoutGrid },
  { name: "TypeScript", icon: Type },
  { name: "Python", icon: FileText },
  { name: "C#", icon: Code },
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
