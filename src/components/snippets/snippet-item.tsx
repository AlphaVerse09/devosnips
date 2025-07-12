
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ClipboardCopy, Edit3, Trash2, FileCode2, CodeSquare, Palette, FileQuestion, FolderKanban, FileText, Database, Type, Eye, Atom } from "lucide-react";
import type { Snippet, SnippetCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { Highlight, themes as prismThemes } from 'prism-react-renderer';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { SnippetViewDialog } from './snippet-view-dialog';

interface SnippetItemProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippetId: string) => void;
}

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

const categoryIcons: Record<SnippetCategory, React.ElementType> = {
  HTML: CodeSquare,
  CSS: Palette,
  JavaScript: FileCode2,
  Python: FileText,
  SQL: Database,
  React: Atom,
  TypeScript: Type,
  'C#': CSharpIcon,
  Java: JavaIcon,
  Go: GoIcon,
  PHP: PHPIcon,
  'C++': CppIcon,
  Kotlin: KotlinIcon,
  Rust: RustIcon,
  Swift: SwiftIcon,
  Angular: AngularIcon,
  Vue: VueIcon,
  Other: FileQuestion,
};

const getLanguageForPrism = (category: SnippetCategory): string => {
  switch (category) {
    case 'HTML':
      return 'markup';
    case 'CSS':
      return 'css';
    case 'JavaScript':
      return 'javascript';
    case 'React':
      return 'jsx';
    case 'Angular':
        return 'tsx'; 
    case 'Vue':
        return 'jsx';
    case 'TypeScript':
      return 'tsx';
    case 'Python':
      return 'python';
    case 'C#':
      return 'csharp';
    case 'SQL':
      return 'sql';
    case 'Java':
        return 'java';
    case 'Go':
        return 'go';
    case 'PHP':
        return 'php';
    case 'C++':
        return 'cpp';
    case 'Kotlin':
        return 'kotlin';
    case 'Rust':
        return 'rust';
    case 'Swift':
        return 'swift';
    case 'Other':
    default:
      return 'plainText';
  }
};

export function SnippetItem({ snippet, onEdit, onDelete }: SnippetItemProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [currentPrismTheme, setCurrentPrismTheme] = useState(prismThemes.vsLight);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setCurrentPrismTheme(resolvedTheme === 'dark' ? prismThemes.nightOwl : prismThemes.vsLight);
    }
  }, [resolvedTheme, isMounted]);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      toast({ title: "Copied!", description: "Code snippet copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Error", description: "Failed to copy code.", variant: "destructive" });
    }
  };

  const handleDeleteConfirm = () => {
    onDelete(snippet.id);
    setIsDeleteDialogOpen(false);
  };

  const CategoryIcon = categoryIcons[snippet.category] || FileQuestion;

  if (!isMounted) {
    return (
        <Card className="shadow-lg flex flex-col animate-pulse">
             <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div className="h-7 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="p-3 rounded-md bg-muted h-36"></div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 mt-auto">
                 <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                    <div className="h-9 w-24 bg-muted rounded-md"></div>
                    <div className="h-9 w-20 bg-muted rounded-md"></div>
                    <div className="h-9 w-24 bg-muted rounded-md"></div>
                </div>
            </CardFooter>
        </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="font-headline text-xl mb-1 break-all">{snippet.title}</CardTitle>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <Badge variant="outline" className="flex items-center gap-1.5 whitespace-nowrap">
                <CategoryIcon className="h-4 w-4" />
                {snippet.category}
              </Badge>
              {snippet.subCategoryName && (
                <Badge variant="secondary" className="flex items-center gap-1.5 whitespace-nowrap">
                  <FolderKanban className="h-3 w-3" /> 
                  {snippet.subCategoryName}
                </Badge>
              )}
            </div>
          </div>
          {snippet.description && <CardDescription className="mt-1">{snippet.description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow">
          <Highlight
            theme={currentPrismTheme}
            code={snippet.code}
            language={getLanguageForPrism(snippet.category)}
          >
            {({ className: prismClassName, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(
                  "p-3 rounded-md overflow-x-auto text-sm max-h-60 font-code",
                  prismClassName
                )}
                style={style}
              >
                {tokens.map((line, i) => {
                  const { key: lineKey, ...restOfLineProps } = getLineProps({ line, key: i });
                  
                  if (style && style.backgroundColor && restOfLineProps.style && restOfLineProps.style.backgroundColor) {
                      delete restOfLineProps.style.backgroundColor;
                  }
                  return(
                    <div key={lineKey} {...restOfLineProps}> 
                      {line.map((token, tokenIdx) => {
                        const { key: tokenKey, ...restOfTokenProps } = getTokenProps({ token, key: tokenIdx });
                        return (
                          <span key={tokenKey} {...restOfTokenProps} /> 
                        );
                      })}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 mt-auto">
          <p className="text-xs text-muted-foreground">
            Last updated: {snippet.updatedAt ? formatDistanceToNow(new Date(snippet.updatedAt), { addSuffix: true }) : 'N/A'}
          </p>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setIsViewDialogOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                View
            </Button>
            <Button variant={copied ? "secondary" : "outline"} size="sm" onClick={handleCopy} className="transition-all">
              <ClipboardCopy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(snippet)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the snippet titled &quot;{snippet.title}&quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
      <SnippetViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        snippet={snippet}
        prismTheme={currentPrismTheme}
        language={getLanguageForPrism(snippet.category)}
      />
    </>
  );
}
