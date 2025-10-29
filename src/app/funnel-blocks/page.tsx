'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UpgradeModal } from '@/components/ui/upgrade-modal'
import { Gated } from '@/components/ui/gated'
import { supabase } from '@/lib/supabase/client'
import { evaluateAccess, getUserSubscriptionStatus } from '@/lib/subscription/utils'

export default function FunnelBlocksPage() {
  const [locked, setLocked] = useState(false)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLocked(true); return }
      const statusRow: any = await getUserSubscriptionStatus(user.id)
      const access = evaluateAccess(statusRow?.status || 'inactive')
      setLocked(access.locked)
    })()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="container mx-auto px-6 py-8">
        <Gated feature="funnelBlocks" requiredPlan="accelerator">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Funnel Pro Blocks</CardTitle>
              <CardDescription>Advanced funnel elements and templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming Soon — unlock with Accelerator OS ✅</p>
              <div className="mt-4">
                <Button onClick={() => setOpen(true)}>View Plans</Button>
              </div>
            </CardContent>
          </Card>
        </Gated>
      </div>
      <UpgradeModal open={open} onOpenChange={setOpen} title="Coming Soon — Accelerator OS" message="Funnel Pro Blocks are unlocked with Accelerator OS. Upgrade to enable." cta="View Plans" />
    </div>
  )
}


