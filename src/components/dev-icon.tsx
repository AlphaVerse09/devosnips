
"use client";

import Image from 'next/image';
import type { SnippetCategory } from '@/types';

const iconMap: Record<SnippetCategory, string> = {
    "JavaScript": "javascript/javascript-original.svg",
    "Python": "python/python-original.svg",
    "React": "react/react-original.svg",
    "TypeScript": "typescript/typescript-original.svg",
    "HTML": "html5/html5-original.svg",
    "CSS": "css3/css3-original.svg",
    "SQL": "azuresqldatabase/azuresqldatabase-original.svg",
    "C#": "csharp/csharp-original.svg",
    "Java": "java/java-original.svg",
    "Go": "go/go-original.svg",
    "PHP": "php/php-original.svg",
    "C++": "cplusplus/cplusplus-original.svg",
    "Kotlin": "kotlin/kotlin-original.svg",
    "Rust": "rust/rust-original.svg",
    "Swift": "swift/swift-original.svg",
    "Angular": "angular/angular-original.svg",
    "Vue": "vuejs/vuejs-original.svg",
    "Other": "", // No icon for 'Other'
};

interface DevIconProps {
  category: SnippetCategory;
  className?: string;
}

export function DevIcon({ category, className }: DevIconProps) {
  const iconSrc = iconMap[category];

  if (!iconSrc) {
    return null; // Return null if category is 'Other' or not found
  }

  const fullSrc = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconSrc}`;

  return (
    <Image
      src={fullSrc}
      alt={`${category} logo`}
      width={16}
      height={16}
      className={className}
      unoptimized // Required for external SVGs
    />
  );
}
