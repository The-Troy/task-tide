"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { groups as groupsApi } from "@/lib/api";
import { Loader2, Wand2 } from "lucide-react";

const setupSchema = z.object({
  groupSize: z.coerce
    .number()
    .min(2, "Group size must be at least 2.")
    .max(10, "Group size cannot exceed 10."),
});

type SetupFormValues = z.infer<typeof setupSchema>;

interface GroupSetupFormProps {
  unitId: number;
  onGroupsCreated: () => void;
}

export function GroupSetupForm({ unitId, onGroupsCreated }: GroupSetupFormProps) {
  const { toast } = useToast();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: { groupSize: 4 },
  });

  async function onSubmit(data: SetupFormValues) {
    try {
      const res = await groupsApi.autoSetup(unitId, data.groupSize);
      toast({
        title: "Groups Created!",
        description: `${res.groups.length} group(s) have been auto-generated for this unit.`,
      });
      onGroupsCreated();
      form.reset();
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create groups.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Auto-Setup Assignment Groups
        </h3>
        <FormField
          control={form.control}
          name="groupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Students per Group</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 4"
                  className="w-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Groups will be created automatically from all enrolled students.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
          ) : (
            <><Wand2 className="mr-2 h-4 w-4" /> Generate Groups</>
          )}
        </Button>
      </form>
    </Form>
  );
}
