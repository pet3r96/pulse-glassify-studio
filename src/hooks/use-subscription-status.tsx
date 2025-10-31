'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getUserSubscriptionStatus, evaluateAccess } from '@/lib/subscription/utils';

export function useSubscriptionStatus() {
  const [accessState, setAccessState] = useState<string>('inactive');
  const [locked, setLocked] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setAccessState('inactive');
          setLocked(true);
          setBanner('Billing Required: Your subscription is not active. Please update your payment method to restore features.');
          setLoading(false);
          return;
        }
        
        // Check if user is super_admin (bypass lock)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        const isSuperAdmin = (profile as any)?.role === 'super_admin';
        
        if (isSuperAdmin) {
          setAccessState('active');
          setLocked(false);
          setBanner(null);
          setLoading(false);
          console.log('[Billing Gate] Super Admin - Bypass lock');
          return;
        }
        
        const statusRow: any = await getUserSubscriptionStatus(user.id);
        const status = statusRow?.status || 'inactive';
        const access = evaluateAccess(status);
        setAccessState(status);
        // Lock UI for all non-active states (past_due, unpaid, incomplete, payment_failed, etc.)
        const isNonActive = status !== 'active';
        setLocked(isNonActive);
        setBanner(access.banner);
        if (isNonActive) {
          console.log('[Billing Gate] Locked:', status, access);
        }
      } catch (error) {
        console.error('[Billing Gate] Error:', error);
        setAccessState('inactive');
        setLocked(true);
        setBanner('Billing Required: Your subscription is not active. Please update your payment method to restore features.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { accessState, locked, banner, loading };
}
