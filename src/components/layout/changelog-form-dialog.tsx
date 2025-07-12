
"use client";

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { addChangelog, updateChangelog, ChangelogEntry } from '@/lib/firebase/firestore';

const changelogFormSchema = z.object({
  version: z.string().min(1, "Version is required, e.g., 1.2.1").max(20),
  date: z.date({ required_error: "A date is required." }),
  changes: z.array(
    z.object({ value: z.string().min(1, "Change description cannot be empty.") })
  ).min(1, "At least one change description is required."),
});

export type ChangelogFormValues = z.infer<typeof changelogFormSchema>;

interface ChangelogFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  changelog: ChangelogEntry | null; // null for adding, existing object for editing
  onSuccess: () => void;
}

export function ChangelogFormDialog({ isOpen, onOpenChange, changelog, onSuccess }: ChangelogFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!changelog;

  const form = useForm<ChangelogFormValues>({
    resolver: zodResolver(changelogFormSchema),
    defaultValues: {
      version: "",
      changes: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "changes",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && changelog) {
        form.reset({
          version: changelog.version,
          date: new Date(changelog.date),
          changes: changelog.changes.map(c => ({ value: c })),
        });
      } else {
        form.reset({
          version: "",
          date: new Date(),
          changes: [{ value: "" }],
        });
      }
    }
  }, [isOpen, isEditing, changelog, form]);

  const handleSubmit = async (values: ChangelogFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && changelog) {
        await updateChangelog(changelog.id, values);
        toast({ title: "Changelog Updated", description: `Version ${values.version} has been saved.` });
      } else {
        await addChangelog(values);
        toast({ title: "Changelog Added", description: `Version ${values.version} has been added.` });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving changelog:", error);
      toast({ title: "Error", description: "Could not save the changelog. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? "Edit Changelog" : "Add New Changelog"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this version." : "Add a new set of release notes."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 1.2.1" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                    <FormLabel>Release Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div>
              <FormLabel>Changes</FormLabel>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`changes.${index}.value`}
                    render={({ field: RHFfield }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Textarea placeholder={`Change description #${index + 1}`} {...RHFfield} className="resize-y min-h-[40px]"/>
                           <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Change
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4 sticky bottom-0 bg-background">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? "Save Changes" : "Add Changelog"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
