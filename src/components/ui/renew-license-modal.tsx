'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface RenewLicenseModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reason?: 'expired'|'limit'|'invalid';
}

export function RenewLicenseModal({ open, onOpenChange, reason }: RenewLicenseModalProps) {
  const router = useRouter();
  const message = reason === 'expired'
    ? 'Your license has expired. Renew to continue applying this theme.'
    : reason === 'limit'
      ? 'You have reached your download limit. Upgrade your license to continue.'
      : 'Your license is not valid. Purchase or renew to continue.';
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>License Required</DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => router.push('/marketplace')}>Browse Themes</Button>
          <Button onClick={() => router.push('/marketplace')}>Purchase / Renew</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


