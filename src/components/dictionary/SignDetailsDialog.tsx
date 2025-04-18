
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SignEntry } from "@/types/dictionary";

interface SignDetailsDialogProps {
  sign: SignEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SignDetailsDialog({ sign, isOpen, onClose }: SignDetailsDialogProps) {
  if (!sign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{sign.name}</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex gap-2 mb-4">
            <span className="bg-purple-100 text-purple px-2 py-1 rounded-full text-sm">
              {sign.category}
            </span>
            <span className="bg-slate-100 text-slate px-2 py-1 rounded-full text-sm">
              {sign.difficulty}
            </span>
          </div>
          
          <DialogDescription className="text-base text-slate-700 mb-4">
            {sign.description}
          </DialogDescription>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                {sign.steps.map((step, index) => (
                  <li key={index} className="text-slate-600">{step}</li>
                ))}
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Tips:</h3>
              <p className="text-slate-600">{sign.tips}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
