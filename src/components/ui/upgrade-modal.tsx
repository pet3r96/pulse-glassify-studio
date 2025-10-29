'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  message?: string;
  cta?: string;
  locked?: boolean;
}

export function UpgradeModal({ open, onOpenChange, title = 'Billing Required', message = 'Your subscription is not active. Please update your payment method to restore features.', cta = 'Manage Billing', locked = true }: UpgradeModalProps) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => router.push('/subscribe?locked=true')}>{cta}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


