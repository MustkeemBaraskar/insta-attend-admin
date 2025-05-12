
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  coordinates: z.string().optional(),
  address: z.string().optional(),
  lead: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: {
    id: number;
    name: string;
    coordinates?: string;
    address?: string;
    lead?: string;
    employeeCount: number;
  };
  onSubmit: (values: DepartmentFormValues) => void;
}

export function DepartmentForm({ open, onOpenChange, department, onSubmit }: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name || "",
      coordinates: department?.coordinates || "",
      address: department?.address || "",
      lead: department?.lead || "",
    },
  });

  const handleSubmit = async (values: DepartmentFormValues) => {
    try {
      setIsSubmitting(true);
      onSubmit(values);
      form.reset();
      onOpenChange(false);
      toast.success(`Department ${department ? "updated" : "created"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${department ? "update" : "create"} department`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{department ? "Edit" : "Add"} Department</DialogTitle>
          <DialogDescription>
            {department ? "Update" : "Create a new"} department for your organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Latitude-Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 12.9716,77.5946" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter physical address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lead"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Lead</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lead name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-attendo-500 hover:bg-attendo-600"
              >
                {isSubmitting ? "Saving..." : department ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
