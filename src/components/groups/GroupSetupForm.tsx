
"use client"

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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/hooks/useAppContext";
import { getSemesters, getUnitsBySemester } from "@/lib/data";
import type { Semester, Unit } from "@/lib/types";

const groupFormSchema = z.object({
  groupName: z.string().min(3, { message: "Group name must be at least 3 characters." }),
  maxSize: z.coerce.number().min(1, { message: "Group size must be at least 1." }).max(10, { message: "Group size cannot exceed 10." }),
  semesterId: z.string().min(1, { message: "Please select a semester." }),
  unitId: z.string().min(1, { message: "Please select a unit." }),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface GroupSetupFormProps {
  onGroupCreated: () => void;
  initialSemesterId?: string;
  initialUnitId?: string;
}

export function GroupSetupForm({ onGroupCreated, initialSemesterId, initialUnitId }: GroupSetupFormProps) {
  const { createGroup, currentUser } = useAppContext();
  const { toast } = useToast();
  
  const [selectedSemester, setSelectedSemester] = React.useState<string>(initialSemesterId || "");

  if (!currentUser) {
    return null;
  }

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      groupName: "",
      maxSize: 4,
      semesterId: initialSemesterId || "",
      unitId: initialUnitId || "",
    },
  });

  const semesters: Semester[] = getSemesters();
  const units: Unit[] = selectedSemester ? getUnitsBySemester(selectedSemester) : [];

  function onSubmit(data: GroupFormValues) {
      if (currentUser.role !== 'class_representative') {
        toast({ title: "Permission Denied", description: "Only class representatives can create groups.", variant: "destructive" });
        return;
      }
      
      const newGroup = createGroup({
        assignmentName: data.groupName,
        maxSize: data.maxSize,
        semesterId: data.semesterId, 
        unitId: data.unitId, 
      });

      if (newGroup) {
        toast({ title: "Group Created", description: `The group "${data.groupName}" has been successfully created.` });
        onGroupCreated();
        form.reset();
      } else {
        toast({ title: "Error", description: "Failed to create the group. Please try again.", variant: "destructive" });
      }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Create a New Assignment Group</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Project Innovate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Group Size</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 4" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semesterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select onValueChange={(value) => { field.onChange(value); setSelectedSemester(value); form.setValue('unitId', ''); }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>{semester.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSemester}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create Group"}
        </Button>
      </form>
    </Form>
  );
}
