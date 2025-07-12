
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getChangelogs, deleteChangelog, ChangelogEntry } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, PlusCircle, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { ChangelogFormDialog } from './changelog-form-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChangelogDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isAdmin: boolean;
}

export function ChangelogDialog({ isOpen, onOpenChange, isAdmin }: ChangelogDialogProps) {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChangelog, setEditingChangelog] = useState<ChangelogEntry | null>(null);
  const [deletingChangelog, setDeletingChangelog] = useState<ChangelogEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleAddClick = () => {
    setEditingChangelog(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (log: ChangelogEntry) => {
    setEditingChangelog(log);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (log: ChangelogEntry) => {
    setDeletingChangelog(log);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingChangelog) return;
    setIsDeleting(true);
    try {
      await deleteChangelog(deletingChangelog.id);
      toast({ title: "Changelog Deleted", description: `Version ${deletingChangelog.version} has been removed.` });
      fetchChangelogs();
      setDeletingChangelog(null);
    } catch (error) {
      console.error("Error deleting changelog:", error);
      toast({ title: "Error", description: "Failed to delete the changelog.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };


  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchChangelogs();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center justify-between">
              <span>Release Notes</span>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={handleAddClick}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Log
                </Button>
              )}
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
                        {isAdmin && (
                          <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(log)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(log)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
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

      {isAdmin && (
        <>
          <ChangelogFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            changelog={editingChangelog}
            onSuccess={handleFormSuccess}
          />
          <AlertDialog open={!!deletingChangelog} onOpenChange={() => setDeletingChangelog(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the release notes for version
                  <span className="font-bold"> {deletingChangelog?.version}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
