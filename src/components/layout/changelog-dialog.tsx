
"use client";

import { useEffect, useState } from "react";
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
import { getChangelogs, type ChangelogEntry } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

interface ChangelogDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdmin: boolean; // Keep for potential future use, but functionality is removed for now
}

export function ChangelogDialog({ isOpen, onOpenChange, isAdmin }: ChangelogDialogProps) {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchChangelogs = async () => {
    setIsLoading(true);
    try {
      const logs = await getChangelogs();
      setChangelogs(logs);
    } catch (error) {
      console.error("Error fetching changelogs:", error);
      // Only show toast on actual error, not for empty list
      toast({ title: "Error", description: "Could not load release notes. Please check your connection.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChangelogs();
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center justify-between">
            <span>Release Notes</span>
          </DialogTitle>
          <DialogDescription>
            See what&apos;s new in the latest version of DevoSnips.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : changelogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mb-2" />
                <p className="font-semibold">No Release Notes Found</p>
                <p className="text-sm">Check back later for new updates!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {changelogs.map((log) => (
                  <div key={log.id}>
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
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
