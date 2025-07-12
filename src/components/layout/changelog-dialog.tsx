
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { changelogs } from "@/lib/changelog-data";
import { CheckCircle2 } from "lucide-react";

interface ChangelogDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ChangelogDialog({ isOpen, onOpenChange }: ChangelogDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Release Notes</DialogTitle>
          <DialogDescription>
            See what&apos;s new in the latest version of DevoSnips.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="flex-grow pr-4 -mr-6">
          <div className="space-y-8">
            {changelogs.map((log) => (
              <div key={log.version}>
                <div className="flex items-center gap-4 mb-2">
                  <Badge variant="default" className="text-base">v{log.version}</Badge>
                  <p className="text-sm text-muted-foreground">{log.date}</p>
                </div>
                <ul className="space-y-2 pl-5">
                  {log.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span className="text-sm">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
