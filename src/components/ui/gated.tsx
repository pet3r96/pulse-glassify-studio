'use client';

import { ReactNode, useEffect, useState } from 'react';
import { UpgradeModal } from '@/components/ui/upgrade-modal';

type PlanTier = 'starter' | 'pro' | 'accelerator' | 'free';

interface GatedProps {
  feature?: string;
  requiredPlan: Exclude<PlanTier, 'free'>;
  children: ReactNode;
}

const planOrder: Record<PlanTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  accelerator: 3,
};

export function Gated({ feature, requiredPlan, children }: GatedProps) {
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('free');
  const [open, setOpen] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/subscription/status');
        if (res.status !== 200) {
          setCurrentPlan('free');
          setCanAccess(false);
          return;
        }
        const json = await res.json();
        const p: PlanTier = (json?.plan?.plan as PlanTier) || 'free';
        setCurrentPlan(p);
        setCanAccess(planOrder[p] >= planOrder[requiredPlan]);
      } catch (_) {
        setCurrentPlan('free');
        setCanAccess(false);
      }
    })();
  }, [requiredPlan]);

  if (canAccess) return <>{children}</>;

  const title = 'Upgrade Required';
  const message = requiredPlan === 'accelerator'
    ? 'This module is part of Accelerator OS. Upgrade to unlock.'
    : 'This feature requires a higher plan. Upgrade to unlock.';
  const ctaUrl = `/subscribe?plan=${requiredPlan}`;

  return (
    <>
      <div aria-disabled className="opacity-60 pointer-events-none select-none">
        {children}
      </div>
      <UpgradeModal
        open={open}
        onOpenChange={setOpen}
        title={title}
        message={`${message}`}
        cta={`View ${requiredPlan === 'accelerator' ? 'Accelerator' : requiredPlan} Plan`}
      />
      {/* Auto-open on mount */}
      {!open && (
        <span className="hidden" onLoad={() => setOpen(true)} />
      )}
    </>
  );
}


