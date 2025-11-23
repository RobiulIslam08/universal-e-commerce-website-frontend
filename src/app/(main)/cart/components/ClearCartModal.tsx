// components/cart/ClearCartModal.tsx
import { AlertCircle } from "lucide-react";

// Shadcn Components
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
import { Button } from "@/components/ui/button";

interface ClearCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearCartModal({ isOpen, onClose, onConfirm }: ClearCartModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
          <AlertDialogTitle className="text-2xl font-bold">Clear Cart?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row">
          <AlertDialogCancel asChild>
             <Button variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0" onClick={onClose}>
               Cancel
             </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700" onClick={onConfirm}>
              Clear All
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}