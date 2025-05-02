
import React from "react";
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
import { employeeService } from "@/api/services";
import { useToast } from "@/hooks/use-toast";

interface DeleteEmployeeDialogProps {
  employeeId: string;
  employeeName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteEmployeeDialog({
  employeeId,
  employeeName,
  isOpen,
  onClose,
  onSuccess,
}: DeleteEmployeeDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await employeeService.deleteEmployee(employeeId);
      onSuccess();
      toast({
        title: "Employee Deleted",
        description: `${employeeName} has been successfully removed.`,
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {employeeName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
