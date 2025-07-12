
"use client";

import type { SnippetCategory } from "@/types";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ListFilter, FileQuestion, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DevIcon } from '@/components/dev-icon';

const mainCategoriesList: Array<{ name: SnippetCategory | "All"; icon: React.ElementType }> = [
  { name: "All", icon: ListFilter },
  { name: "HTML", icon: (props) => <DevIcon category="HTML" {...props} /> },
  { name: "CSS", icon: (props) => <DevIcon category="CSS" {...props} /> },
  { name: "JavaScript", icon: (props) => <DevIcon category="JavaScript" {...props} /> },
  { name: "React", icon: (props) => <DevIcon category="React" {...props} /> },
  { name: "TypeScript", icon: (props) => <DevIcon category="TypeScript" {...props} /> },
  { name: "Python", icon: (props) => <DevIcon category="Python" {...props} /> },
  { name: "C#", icon: (props) => <DevIcon category="C#" {...props} /> },
  { name: "SQL", icon: (props) => <DevIcon category="SQL" {...props} /> },
  { name: "Java", icon: (props) => <DevIcon category="Java" {...props} /> },
  { name: "Go", icon: (props) => <DevIcon category="Go" {...props} /> },
  { name: "PHP", icon: (props) => <DevIcon category="PHP" {...props} /> },
  { name: "C++", icon: (props) => <DevIcon category="C++" {...props} /> },
  { name: "Kotlin", icon: (props) => <DevIcon category="Kotlin" {...props} /> },
  { name: "Rust", icon: (props) => <DevIcon category="Rust" {...props} /> },
  { name: "Swift", icon: (props) => <DevIcon category="Swift" {...props} /> },
  { name: "Angular", icon: (props) => <DevIcon category="Angular" {...props} /> },
  { name: "Vue", icon: (props) => <DevIcon category="Vue" {...props} /> },
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
              <Icon className="h-4 w-4" />
              <span>{name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      {mainCategoriesList.length > INITIAL_VISIBLE_COUNT && (
        <div className="px-4 py-2">
            <Button
            variant="ghost"
            className="w-full justify-start text-xs h-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
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
