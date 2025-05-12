
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const designationSchema = z.object({
  name: z.string().min(1, "Designation name is required"),
  hasAdminAccess: z.boolean().default(false),
});

type DesignationFormValues = z.infer<typeof designationSchema>;

interface DesignationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designation?: {
    id: number;
    name: string;
    department: string;
    hasAdminAccess?: boolean;
  };
  departments: { id: number; name: string }[];
  onSubmit: (values: DesignationFormValues & { departmentId: number }) => void;
}

export function DesignationForm({ 
  open, 
  onOpenChange, 
  designation, 
  departments,
  onSubmit 
}: DesignationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentId, setDepartmentId] = useState<number>(
    departments.find(d => d.name === designation?.department)?.id || departments[0]?.id
  );
  
  const form = useForm<DesignationFormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      name: designation?.name || "",
      hasAdminAccess: designation?.hasAdminAccess || false,
    },
  });

  const handleSubmit = async (values: DesignationFormValues) => {
    try {
      setIsSubmitting(true);
      onSubmit({ ...values, departmentId });
      form.reset();
      onOpenChange(false);
      toast.success(`Designation ${designation ? "updated" : "created"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${designation ? "update" : "create"} designation`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{designation ? "Edit" : "Add"} Designation</DialogTitle>
          <DialogDescription>
            {designation ? "Update" : "Create a new"} designation for your organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter designation title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Department</FormLabel>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={departmentId}
                onChange={(e) => setDepartmentId(Number(e.target.value))}
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <FormField
              control={form.control}
              name="hasAdminAccess"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Admin Access
                    </FormLabel>
                    <FormDescription>
                      Grant admin privileges to this designation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                {isSubmitting ? "Saving..." : designation ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
