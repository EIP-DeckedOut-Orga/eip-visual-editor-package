import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { ReactNode } from "react";

type ConfirmationDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  cancelVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  disabled?: boolean;
};

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  cancelVariant = "outline",
  onConfirm,
  onCancel,
  onClose,
  disabled = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Dialog onOpenChange={(open) => !open && onClose?.()}>
      <DialogTrigger disabled={disabled} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="flex w-full gap-2" asChild>
            <Button
              variant={confirmVariant}
              className="w-full text-foreground"
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={cancelVariant} onClick={handleCancel}>
              {cancelText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}