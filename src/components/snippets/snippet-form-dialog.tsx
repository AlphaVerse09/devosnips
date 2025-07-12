
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Snippet, SnippetCategory, UserSubCategory } from "@/types";
import { performCodeClassification } from "@/app/actions";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { addUserSubCategory, getUserSubCategories } from '@/lib/firebase/firestore';
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react';

const snippetFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  code: z.string().min(1, "Code is required"),
  manualCategory: z.enum(['HTML', 'CSS', 'JavaScript', 'Python', 'SQL', 'React', 'TypeScript', 'C#', 'Java', 'Go', 'PHP', 'C++', 'Kotlin', 'Rust', 'Swift', 'Angular', 'Vue', 'Other']).optional(),
  subCategoryName: z.string().max(100).optional(),
  newSubCategoryName: z.string().max(100).optional(),
});

export type SnippetFormValues = z.infer<typeof snippetFormSchema>;

interface SnippetFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  snippet: Snippet | null;
  onSubmitSuccess: (
    data: SnippetFormValues,
    aiDetectedCategory: SnippetCategory,
    finalSubCategoryName?: string,
    id?: string
  ) => void;
  currentSnippetCount: number; // For client-side UX
  maxSnippets: number; // For client-side UX
}

const mainCategories: SnippetCategory[] = ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Python', 'C#', 'SQL', 'Java', 'Go', 'PHP', 'C++', 'Kotlin', 'Rust', 'Swift', 'Angular', 'Vue', 'Other'];
const NO_SUBCATEGORY_VALUE = "___NONE___";

export function SnippetFormDialog({ isOpen, onOpenChange, snippet, onSubmitSuccess, currentSnippetCount, maxSnippets }: SnippetFormDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingSubCategory, setIsSubmittingSubCategory] = useState(false);
  const [availableSubCategories, setAvailableSubCategories] = useState<UserSubCategory[]>([]);
  
  const form = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      manualCategory: undefined,
      subCategoryName: undefined,
      newSubCategoryName: "",
    },
  });

  const selectedManualCategory = form.watch("manualCategory");
  const isEditing = !!snippet;
  const limitReached = !isEditing && currentSnippetCount >= maxSnippets;


  const fetchSubCategories = useCallback(async (parentCat: SnippetCategory | undefined) => {
    if (!user || !parentCat) {
      setAvailableSubCategories([]);
      return;
    }
    try {
      const subs = await getUserSubCategories(user.uid, parentCat);
      setAvailableSubCategories(subs);
    } catch (error) {
      console.error("Failed to fetch sub-categories", error);
      toast({ title: "Error", description: "Could not load sub-categories.", variant: "destructive" });
      setAvailableSubCategories([]);
    }
  }, [user, toast]);

  useEffect(() => {
    if (isOpen && user) {
      if (snippet) {
        form.reset({
          title: snippet.title,
          description: snippet.description || "",
          code: snippet.code,
          manualCategory: snippet.category,
          subCategoryName: snippet.subCategoryName,
          newSubCategoryName: "",
        });
        if (snippet.category) {
          fetchSubCategories(snippet.category);
        }
      } else {
        form.reset({ title: "", description: "", code: "", manualCategory: undefined, subCategoryName: undefined, newSubCategoryName: "" });
        setAvailableSubCategories([]);
      }
    }
  }, [snippet, isOpen, form, user, fetchSubCategories]);

  useEffect(() => {
    if (selectedManualCategory && user) {
      fetchSubCategories(selectedManualCategory);
      form.setValue("subCategoryName", undefined);
      form.setValue("newSubCategoryName", "");
    } else if (!selectedManualCategory) {
      setAvailableSubCategories([]);
    }
  }, [selectedManualCategory, user, fetchSubCategories, form]);

  const handleAddNewSubCategory = async () => {
    if (!user || !selectedManualCategory) {
      toast({ title: "Error", description: "Please select a main category first.", variant: "destructive" });
      return;
    }
    const newName = form.getValues("newSubCategoryName")?.trim();
    if (!newName) {
      toast({ title: "Error", description: "New sub-category name cannot be empty.", variant: "destructive" });
      return;
    }
    // TODO: Add sub-category limit check here if implemented

    setIsSubmittingSubCategory(true);
    try {
      const newSub = await addUserSubCategory(user.uid, newName, selectedManualCategory);
      toast({ title: "Sub-category Added", description: `Successfully added "${newSub.name}".` });
      form.setValue("newSubCategoryName", "");
      await fetchSubCategories(selectedManualCategory);
      form.setValue("subCategoryName", newSub.name);
    } catch (error) {
      console.error("Error adding new sub-category:", error);
      toast({ title: "Error", description: "Failed to add new sub-category.", variant: "destructive" });
    } finally {
      setIsSubmittingSubCategory(false);
    }
  };

  const handleSubmit = async (values: SnippetFormValues) => {
    if (!user) return;
    if (limitReached && !isEditing) {
      toast({
          title: "Snippet Limit Reached",
          description: `Cannot add new snippet. Maximum is ${maxSnippets}.`,
          variant: "destructive",
        });
      return;
    }
    setIsSubmitting(true);
    let finalSubCatName = values.subCategoryName;

    try {
      finalSubCatName = form.getValues("subCategoryName"); 

      const classificationResult = await performCodeClassification({ code: values.code });
      if (classificationResult.error) {
        toast({
          title: "Classification Warning",
          description: `Could not accurately classify code: ${classificationResult.error}. Defaulted to 'Other'.`,
          variant: "default",
        });
      }
      
      const finalCategory = values.manualCategory || classificationResult.category;
      
      onSubmitSuccess(values, finalCategory, finalSubCatName === NO_SUBCATEGORY_VALUE ? undefined : finalSubCatName, snippet?.id);
      // onOpenChange(false); // onSubmitSuccess will handle this or HomePage will
    } catch (error) { // Error handled in HomePage handleSubmitForm
      console.error("Error submitting snippet from dialog:", error);
      // No toast here as HomePage handles it
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="font-headline">{snippet ? "Edit Snippet" : "Add New Snippet"}</DialogTitle>
          <DialogDescription>
            {snippet ? "Update the details of your code snippet." : "Fill in the details. Category can be manually set or auto-detected."}
          </DialogDescription>
        </DialogHeader>
        {limitReached && !isEditing && (
          <div className="p-3 mb-4 text-sm text-destructive-foreground bg-destructive/80 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>You have reached the maximum of {maxSnippets} snippets. Please delete some to add new ones.</span>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-x-6 gap-y-4 py-4">
              <div className="md:col-span-3 space-y-4 flex flex-col">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., JavaScript Fetch Function" {...field} disabled={isSubmitting || (limitReached && !isEditing)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A short description of what this snippet does." className="resize-none" rows={3} {...field} disabled={isSubmitting || (limitReached && !isEditing)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-grow">
                      <FormLabel>Code</FormLabel>
                      <FormControl className="flex-grow">
                        <Textarea placeholder="Paste your code here..." className="min-h-[150px] md:min-h-[250px] flex-grow font-code text-sm resize-y" {...field} disabled={isSubmitting || (limitReached && !isEditing)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="manualCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Category (Optional - AI will classify if not set)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || (limitReached && !isEditing)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a main category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mainCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedManualCategory && (
                  <>
                    <FormField
                      control={form.control}
                      name="subCategoryName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub-Category (Optional)</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              if (value === NO_SUBCATEGORY_VALUE) {
                                field.onChange(undefined);
                              } else {
                                field.onChange(value);
                              }
                            }} 
                            value={field.value || NO_SUBCATEGORY_VALUE} 
                            disabled={isSubmitting || (limitReached && !isEditing) || isSubmittingSubCategory}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select or create new" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={NO_SUBCATEGORY_VALUE}>None</SelectItem>
                              {availableSubCategories.map(subCat => (
                                <SelectItem key={subCat.id} value={subCat.name}>{subCat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Or Create New Sub-category for &quot;{selectedManualCategory}&quot;</FormLabel>
                      <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="newSubCategoryName"
                            render={({ field }) => (
                               <Input placeholder="Type new sub-category name" {...field} className="flex-grow" disabled={isSubmitting || (limitReached && !isEditing) || isSubmittingSubCategory}/>
                            )}
                            />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleAddNewSubCategory} 
                          disabled={isSubmitting || (limitReached && !isEditing) || isSubmittingSubCategory || !form.getValues("newSubCategoryName")?.trim()}
                        >
                          {isSubmittingSubCategory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                          Add
                        </Button>
                      </div>
                       <FormMessage>{form.formState.errors.newSubCategoryName?.message}</FormMessage>
                    </FormItem>
                  </>
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting || isSubmittingSubCategory}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isSubmittingSubCategory || (limitReached && !isEditing)}>
                {(isSubmitting || isSubmittingSubCategory) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {snippet ? "Save Changes" : "Add Snippet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
