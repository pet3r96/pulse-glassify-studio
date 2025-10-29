'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BillingEvent {
  id: string;
  user_id: string;
  event: 'activated' | 'failed' | 'rollback' | 'upgrade' | 'cancel';
  stripe_subscription_id: string | null;
  recorded_at: string;
}

export default function BillingLogsPage() {
  const [events, setEvents] = useState<BillingEvent[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('billing_events')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(200);
      if (!error && data) setEvents(data as any);
    })();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing Events (Last 200)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Subscription</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{new Date(e.recorded_at).toLocaleString()}</td>
                    <td className="py-2 pr-4">{e.user_id}</td>
                    <td className="py-2 pr-4">{e.event}</td>
                    <td className="py-2 pr-4">{e.stripe_subscription_id || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


