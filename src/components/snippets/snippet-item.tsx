
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
import { ClipboardCopy, Edit3, Trash2, FileCode2, CodeSquare, Palette, FileQuestion, FolderKanban, FileText, Database, LayoutGrid, Type, Code, Eye, Atom, Coffee } from "lucide-react";
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
