
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Snippet, SnippetCategory } from '@/types';
import { AppHeader } from '@/components/layout/header';
import { SnippetList } from '@/components/snippets/snippet-list';
import { SnippetFormDialog } from '@/components/snippets/snippet-form-dialog';
import type { SnippetFormValues } from '@/components/snippets/snippet-form-dialog';
import { SearchBar } from '@/components/snippets/search-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import {
  addSnippetToFirestore,
  getSnippetsFromFirestore,
  updateSnippetInFirestore,
  deleteSnippetFromFirestore,
  SnippetLimitError, 
  MAX_SNIPPETS_PER_USER,
  ADMIN_MAX_SNIPPETS,
  ADMIN_USER_IDS,
  getCurrentSnippetCount
} from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, SidebarHeader, SidebarTrigger, SidebarRail } from '@/components/ui/sidebar';
import { MainCategoryNav } from '@/components/layout/main-category-nav';
import { SubcategoryNav } from '@/components/snippets/subcategory-nav';
import { AddSubcategoryDialog } from '@/components/snippets/add-subcategory-dialog';


type SortOption =
  | 'updatedAt_desc'
  | 'updatedAt_asc'
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'title_asc'
  | 'title_desc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'updatedAt_desc', label: 'Date Updated (Newest)' },
  { value: 'updatedAt_asc', label: 'Date Updated (Oldest)' },
  { value: 'createdAt_desc', label: 'Date Created (Newest)' },
  { value: 'createdAt_asc', label: 'Date Created (Oldest)' },
  { value: 'title_asc', label: 'Title (A-Z)' },
  { value: 'title_desc', label: 'Title (Z-A)' },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSubCategory, setFilterSubCategory] = useState<string | null>('All');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt_desc');
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddSubCategoryDialogOpen, setIsAddSubCategoryDialogOpen] = useState(false);
  const [forceSubCategoryNavRefresh, setForceSubCategoryNavRefresh] = useState(0);
  const [currentSnippetCount, setCurrentSnippetCount] = useState(0);
  const [isLoadingSnippetCount, setIsLoadingSnippetCount] = useState(false);

  const { toast } = useToast();

  const isAdmin = useMemo(() => user ? ADMIN_USER_IDS.includes(user.uid) : false, [user]);

  const effectiveMaxSnippets = useMemo(() => {
    return isAdmin ? ADMIN_MAX_SNIPPETS : MAX_SNIPPETS_PER_USER;
  }, [isAdmin]);

  const fetchUserSnippetCount = useCallback(async () => {
    if (!user) return;
    setIsLoadingSnippetCount(true);
    try {
      const count = await getCurrentSnippetCount(user.uid);
      setCurrentSnippetCount(count);
    } catch (error) {
      console.error("Failed to load snippet count", error);
    } finally {
      setIsLoadingSnippetCount(false);
    }
  }, [user]);

  const fetchSnippets = useCallback(async () => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      const userSnippets = await getSnippetsFromFirestore(user.uid);
      setSnippets(userSnippets);
      setCurrentSnippetCount(userSnippets.length); 
    } catch (error) {
      console.error("Failed to load snippets from Firestore", error);
      toast({ title: "Error", description: "Could not load your snippets. Please try again.", variant: "destructive" });
    } finally {
      setIsLoadingData(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchSnippets();
    } else {
      setSnippets([]);
      setCurrentSnippetCount(0);
      setIsLoadingData(false);
    }
  }, [user, fetchSnippets]);

  useEffect(() => {
    setFilterSubCategory("All");
  }, [filterCategory]);

  const handleAddSnippetClick = async () => {
    if (!user) return;
    // Fetch the latest count before opening the dialog to be sure
    // This is a quick operation.
    const count = await getCurrentSnippetCount(user.uid);
    setCurrentSnippetCount(count);

    if (count >= effectiveMaxSnippets) {
      toast({
        title: "Snippet Limit Reached",
        description: `You cannot add more snippets. The maximum is ${effectiveMaxSnippets}.`,
        variant: "destructive",
      });
      return;
    }
    setEditingSnippet(null);
    setIsFormOpen(true);
  };

  const handleEditSnippet = (snippetToEdit: Snippet) => {
    setEditingSnippet(snippetToEdit);
    setIsFormOpen(true);
  };

  const handleDeleteSnippet = async (snippetId: string) => {
    if (!user) return;
    try {
      await deleteSnippetFromFirestore(user.uid, snippetId);
      toast({ title: "Snippet Deleted", description: "The code snippet has been removed." });
      fetchSnippets(); 
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast({ title: "Error", description: "Could not delete snippet. Please try again.", variant: "destructive" });
    }
  };

  const handleSubmitForm = async (
    data: SnippetFormValues,
    finalCategory: SnippetCategory,
    subCategoryName?: string,
    existingId?: string
  ) => {
    if (!user) return;
    try {
      if (existingId) {
        await updateSnippetInFirestore(user.uid, existingId, data, finalCategory, subCategoryName);
        toast({ title: "Snippet Updated", description: "Your code snippet has been successfully updated." });
      } else {
        await addSnippetToFirestore(user.uid, data, finalCategory, subCategoryName);
        toast({ title: "Snippet Added", description: "New code snippet saved successfully." });
      }
      fetchSnippets(); 
      setIsFormOpen(false);
      if (subCategoryName || data.newSubCategoryName) {
         handleSubCategoryListModified();
      }
    } catch (error) {
      console.error("Error saving snippet:", error);
      if (error instanceof SnippetLimitError) {
        toast({ title: "Snippet Limit Reached", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Could not save snippet. Please try again.", variant: "destructive" });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been signed out successfully."});
    } catch (error) {
      console.error("Error signing out:", error);
      toast({ title: "Sign Out Failed", description: "Could not sign out. Please try again.", variant: "destructive"});
    }
  };

  const handleAddSubCategory = () => {
    if (filterCategory && filterCategory !== "All") {
      setIsAddSubCategoryDialogOpen(true);
    } else {
      toast({ title: "Select Main Category", description: "Please select a main category (HTML, CSS, etc.) from the sidebar before adding a sub-category.", variant: "default"});
    }
  };
  
  const handleSubCategoryListModified = useCallback(async () => {
    setForceSubCategoryNavRefresh(prev => prev + 1);
    await fetchSnippets(); 
  },[fetchSnippets]);


  const filteredAndSortedSnippets = useMemo(() => {
    let tempSnippets = snippets;

    if (filterCategory !== 'All') {
      tempSnippets = tempSnippets.filter(s => s.category === filterCategory);
      if (filterSubCategory && filterSubCategory !== 'All') {
        tempSnippets = tempSnippets.filter(s => s.subCategoryName === filterSubCategory);
      }
    }
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempSnippets = tempSnippets.filter(s =>
        s.title.toLowerCase().includes(lowerSearchTerm) ||
        (s.description && s.description.toLowerCase().includes(lowerSearchTerm)) ||
        s.code.toLowerCase().includes(lowerSearchTerm) ||
        (s.subCategoryName && s.subCategoryName.toLowerCase().includes(lowerSearchTerm))
      );
    }

    return [...tempSnippets].sort((a, b) => {
      const aDateCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDateCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const aDateUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bDateUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      switch (sortOption) {
        case 'createdAt_asc':
          return aDateCreated - bDateCreated;
        case 'createdAt_desc':
          return bDateCreated - aDateCreated;
        case 'updatedAt_asc':
          return aDateUpdated - bDateUpdated;
        case 'updatedAt_desc':
          return bDateUpdated - aDateUpdated;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [snippets, filterCategory, filterSubCategory, searchTerm, sortOption]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
             <span className="font-bold font-headline text-xl">DevoSnips</span>
          </div>
        </header>
        <main className="flex-1 container mx-auto p-4 md:p-8 space-y-6 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground ml-3">Redirecting to login...</p>
        </main>
      </div>
    );
  }
  
  if (isLoadingData && !snippets.length) {
     return (
      <SidebarProvider>
        <div className="flex flex-col min-h-screen">
           <AppHeader onAddSnippet={handleAddSnippetClick} onSignOut={handleSignOut} userEmail={user?.email} />
          <main className="flex-1 container mx-auto p-4 md:p-8 space-y-6 flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground ml-3">Loading your snippets...</p>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader onAddSnippet={handleAddSnippetClick} onSignOut={handleSignOut} userEmail={user?.email} />
        <div className="flex flex-1">
          <Sidebar collapsible="icon" className="border-r" side="left">
            <SidebarRail />
            <SidebarContent>
              <SidebarHeader className="p-2 pt-4">
                <h2 className="text-lg font-semibold font-headline px-2">Categories</h2>
              </SidebarHeader>
              <MainCategoryNav
                activeMainCategory={filterCategory}
                onSelectMainCategory={setFilterCategory}
              />
               <div className="p-2 mt-auto">
                <p className="text-xs text-muted-foreground px-2">
                  Snippets: {currentSnippetCount} / {effectiveMaxSnippets}
                </p>
              </div>
            </SidebarContent>
          </Sidebar>

          <SidebarInset>
            <main className="flex flex-1 flex-col p-3 sm:p-4 md:p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-4 rounded-lg border bg-card shadow-sm">
                <SearchBar currentSearch={searchTerm} onSearchChange={setSearchTerm} className="w-full md:w-auto md:flex-1 md:max-w-md" />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Label htmlFor="sort-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</Label>
                  <Select
                    value={sortOption}
                    onValueChange={(value) => setSortOption(value as SortOption)}
                  >
                    <SelectTrigger id="sort-select" className="w-full sm:w-[200px] h-9 text-sm">
                      <SelectValue placeholder="Sort snippets" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value} className="text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filterCategory && filterCategory !== "All" && (
                 <div className="p-4 rounded-lg border bg-card shadow-sm" key={forceSubCategoryNavRefresh}>
                    <SubcategoryNav
                      selectedMainCategory={filterCategory as SnippetCategory | "All"}
                      activeSubCategory={filterSubCategory}
                      onSelectSubCategory={setFilterSubCategory}
                      onAddSubCategoryClick={handleAddSubCategory}
                      onSubCategoryModified={handleSubCategoryListModified}
                    />
                 </div>
              )}

              {(isLoadingData || isLoadingSnippetCount) && snippets.length > 0 && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground ml-2">Updating snippets...</p>
                </div>
              )}
              <div className="flex-1">
                <SnippetList
                  snippets={filteredAndSortedSnippets}
                  onEdit={handleEditSnippet}
                  onDelete={handleDeleteSnippet}
                />
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
      <SnippetFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        snippet={editingSnippet}
        onSubmitSuccess={handleSubmitForm}
        currentSnippetCount={currentSnippetCount}
        maxSnippets={effectiveMaxSnippets}
      />
      {filterCategory && filterCategory !== "All" && (
        <AddSubcategoryDialog
          isOpen={isAddSubCategoryDialogOpen}
          onOpenChange={setIsAddSubCategoryDialogOpen}
          mainCategory={filterCategory as SnippetCategory}
          onSubCategoryAdded={handleSubCategoryListModified}
        />
      )}
    </SidebarProvider>
  );
}
