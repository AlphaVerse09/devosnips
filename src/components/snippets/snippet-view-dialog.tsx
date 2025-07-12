
"use client";

import { useState } from 'react';
import type { Theme } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Snippet } from "@/types";
import { cn } from '@/lib/utils';
import { ClipboardCopy } from 'lucide-react';

interface SnippetViewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  snippet: Snippet | null;
  prismTheme: Theme;
  language: string;
}

export function SnippetViewDialog({ isOpen, onOpenChange, snippet, prismTheme, language }: SnippetViewDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!snippet) {
    return null;
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-headline text-2xl">{snippet.title}</DialogTitle>
          {snippet.description && (
            <DialogDescription>{snippet.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-grow overflow-y-auto px-6">
          <Highlight
            theme={prismTheme}
            code={snippet.code}
            language={language}
          >
            {({ className: prismClassName, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(
                  "p-4 rounded-md overflow-x-auto text-sm w-full font-code",
                  prismClassName
                )}
                style={style}
              >
                {tokens.map((line, i) => {
                  const { key: lineKey, ...restOfLineProps } = getLineProps({ line, key: i });
                   if (style && style.backgroundColor && restOfLineProps.style && restOfLineProps.style.backgroundColor) {
                       delete restOfLineProps.style.backgroundColor;
                  }
                  return (
                    <div key={lineKey} {...restOfLineProps}>
                      {line.map((token, tokenIdx) => {
                        const { key: tokenKey, ...restOfTokenProps } = getTokenProps({ token, key: tokenIdx });
                        return <span key={tokenKey} {...restOfTokenProps} />;
                      })}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
        <DialogFooter className="p-6 pt-4 bg-background/95 border-t">
            <Button variant={copied ? "secondary" : "default"} onClick={handleCopy} className="transition-all">
              <ClipboardCopy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy Code"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
