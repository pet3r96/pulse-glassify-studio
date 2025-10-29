'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface SeatLimitModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function SeatLimitModal({ open, onOpenChange }: SeatLimitModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddSeat = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/add-seat', { method: 'POST' });
      const json = await res.json();
      if (json?.url) window.location.href = json.url;
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (value: boolean) => {
    if (value && open === false) {
      // opening
      try {
        await fetch('/api/billing/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'seat_limit_exceeded' }),
        });
      } catch (_) {}
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seat Limit Reached</DialogTitle>
          <DialogDescription>
            You’ve reached your subaccount limit. Add seats for $29/mo or upgrade your plan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => router.push('/subscribe')}>Upgrade Plan</Button>
          <Button onClick={handleAddSeat} disabled={loading}>{loading ? 'Redirecting...' : 'Add Seat ($29/mo)'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


