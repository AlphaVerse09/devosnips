 
"use client";

import { useEffect, useState, useCallback } from 'react';
import type { SnippetCategory, UserSubCategory } from '@/types';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, FolderKanban, ListFilter, Loader2, Trash2 } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import { getUserSubCategories, deleteUserSubCategory } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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

interface SubcategoryNavProps {
  selectedMainCategory: SnippetCategory | "All" | null;
  activeSubCategory: string | null; // Can be "All" or a specific sub-category name
  onSelectSubCategory: (subCategory: string | null) => void; // null for "All Sub-categories"
  onAddSubCategoryClick: () => void;
  onSubCategoryModified: () => void; // Generic callback for add/delete
}

interface DeletingSubCategoryInfo {
  id: string;
  name: string;
  parentCategory: SnippetCategory;
}

export function SubcategoryNav({
  selectedMainCategory,
  activeSubCategory,
  onSelectSubCategory,
  onAddSubCategoryClick,
  onSubCategoryModified
}: SubcategoryNavProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subCategories, setSubCategories] = useState<UserSubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingSubCategoryInfo, setDeletingSubCategoryInfo] = useState<DeletingSubCategoryInfo | null>(null);


  const fetchSubCategories = useCallback(async () => {
    if (!user || !selectedMainCategory || selectedMainCategory === "All") {
      setSubCategories([]);
      return;
    }
    setIsLoading(true);
    try {
      const fetchedSubs = await getUserSubCategories(user.uid, selectedMainCategory as SnippetCategory);
      setSubCategories(fetchedSubs);
    } catch (error) {
      console.error("Failed to fetch sub-categories:", error);
      toast({ title: "Error", description: "Could not load sub-categories.", variant: "destructive" });
      setSubCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedMainCategory, toast]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const handleDeleteClick = (subCategory: UserSubCategory) => {
    if (!selectedMainCategory || selectedMainCategory === "All") return;
    setDeletingSubCategoryInfo({ 
      id: subCategory.id, 
      name: subCategory.name, 
      parentCategory: selectedMainCategory as SnippetCategory 
    });
  };

  const handleDeleteConfirm = async () => {
    if (!user || !deletingSubCategoryInfo) return;
    setIsDeleting(true);
    try {
      await deleteUserSubCategory(
        user.uid, 
        deletingSubCategoryInfo.id, 
        deletingSubCategoryInfo.parentCategory,
        deletingSubCategoryInfo.name
      );
      toast({ title: "Sub-category Deleted", description: `Successfully deleted "${deletingSubCategoryInfo.name}". Snippets using it have been updated.` });
      
      if (activeSubCategory === deletingSubCategoryInfo.name) {
        onSelectSubCategory("All"); // Reset filter if active sub-category was deleted
      }
      onSubCategoryModified(); // Refresh lists
      setDeletingSubCategoryInfo(null);
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      toast({ title: "Error", description: "Failed to delete sub-category.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!selectedMainCategory || selectedMainCategory === "All") {
    return <div className="h-9"></div>; // Placeholder for height consistency or a message
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Label htmlFor="subcategory-filter" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Sub-categories for &quot;{selectedMainCategory}&quot;:
          </Label>
        </div>
        <div className="flex flex-wrap gap-2 items-center flex-grow">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <>
              <Button
                variant={!activeSubCategory || activeSubCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectSubCategory("All")}
                aria-label="Filter by All Sub-categories"
                id="subcategory-filter"
              >
                <ListFilter className="h-4 w-4 mr-1" />
                All Sub-categories
              </Button>
              {subCategories.map((sub) => (
                <div key={sub.id} className="flex items-center gap-1">
                  <Button
                    variant={activeSubCategory === sub.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectSubCategory(sub.name)}
                    aria-label={`Filter by ${sub.name}`}
                    className="rounded-r-none"
                  >
                    <FolderKanban className="h-4 w-4 mr-1" />
                    {sub.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(sub)}
                    aria-label={`Delete sub-category ${sub.name}`}
                    className="p-2 h-9 rounded-l-none border-l-0 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onAddSubCategoryClick} className="whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sub-category
        </Button>
      </div>

      {deletingSubCategoryInfo && (
        <AlertDialog open={!!deletingSubCategoryInfo} onOpenChange={() => setDeletingSubCategoryInfo(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the sub-category &quot;{deletingSubCategoryInfo.name}&quot; under &quot;{deletingSubCategoryInfo.parentCategory}&quot;.
                Any snippets currently using this sub-category will have it removed. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Sub-category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
