 
"use client";

import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { SnippetCategory } from "@/types";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { addUserSubCategory } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';

const addSubCategoryFormSchema = z.object({
  name: z.string().min(1, "Sub-category name is required").max(50, "Sub-category name must be 50 characters or less"),
});

type AddSubCategoryFormValues = z.infer<typeof addSubCategoryFormSchema>;

interface AddSubCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mainCategory: SnippetCategory;
  onSubCategoryAdded: () => void; // Callback to refresh sub-category list
}

export function AddSubcategoryDialog({ isOpen, onOpenChange, mainCategory, onSubCategoryAdded }: AddSubCategoryDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<AddSubCategoryFormValues>({
    resolver: zodResolver(addSubCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ name: "" });
    }
  }, [isOpen, form]);

  const handleSubmit = async (values: AddSubCategoryFormValues) => {
    if (!user || !mainCategory) {
      toast({ title: "Error", description: "User or main category not specified.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await addUserSubCategory(user.uid, values.name, mainCategory);
      toast({ title: "Sub-category Added", description: `Successfully added "${values.name}" to ${mainCategory}.` });
      onSubCategoryAdded(); // Trigger refresh
      onOpenChange(false); 
    } catch (error) {
      console.error("Error adding new sub-category:", error);
      let description = "Failed to add new sub-category. Please try again.";
      if (error instanceof Error && error.message.includes("already exists")) { // Basic check, can be improved
        description = `Sub-category "${values.name}" already exists in ${mainCategory}.`;
      }
      toast({ title: "Error", description, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mainCategory) return null; // Should not happen if dialog is opened correctly

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Sub-category</DialogTitle>
          <DialogDescription>
            Create a new sub-category under &quot;{mainCategory}&quot;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Forms, Navigation, Utilities" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Sub-category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
