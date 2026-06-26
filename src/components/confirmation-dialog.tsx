import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type ConfirmationDialogProps = {
  actionClassName?: string;
  actionLabel: string;
  cancelLabel: string;
  children: ReactNode;
  description: ReactNode;
  disabled?: boolean;
  icon: ReactNode;
  mediaClassName?: string;
  onConfirm: () => void;
  title: string;
  variant?: "default" | "destructive";
};

export function ConfirmationDialog({
  actionClassName,
  actionLabel,
  cancelLabel,
  children,
  description,
  disabled,
  icon,
  mediaClassName,
  onConfirm,
  title,
  variant = "default",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className={mediaClassName}>{icon}</AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={cn(actionClassName)}
            disabled={disabled}
            onClick={onConfirm}
            variant={variant}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
