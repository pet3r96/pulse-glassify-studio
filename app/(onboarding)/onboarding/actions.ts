'use server';

import { createClient, getUser } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function validateGHLApiKey(apiKey: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.functions.invoke('validate-ghl-api-key', {
    body: { apiKey }
  });

  return { valid: !error && data?.valid };
}

export async function completeOnboarding(formData: any) {
  const user = await getUser();
  const supabase = await createClient();
  
  // Get or create agency
  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id, role')
    .eq('id', user.id)
    .single();
  
  let agencyId = profile?.agency_id;
  
  // Only create agency if user is agency owner
  if (!agencyId && profile?.role === 'agency') {
    const { data: newAgency, error: agencyError } = await supabase
      .from('agencies')
      .insert([{ 
        name: user.email || 'My Agency', 
        owner_id: user.id 
      }])
      .select()
      .single();
    
    if (agencyError) throw agencyError;
    
    agencyId = newAgency.id;
    
    // Update profile with agency_id
    await supabase
      .from('profiles')
      .update({ agency_id: agencyId })
      .eq('id', user.id);
  }
  
  // Update agency with onboarding data (only if agency owner)
  if (agencyId && profile?.role === 'agency') {
    await supabase
      .from('agencies')
      .update({
        ghl_api_key: formData.apiKey,
        ghl_api_key_valid: formData.apiKeyValid,
        ghl_api_key_last_validated: new Date().toISOString(),
        base_theme: formData.baseTheme,
        logo_url: formData.logoUrl,
        favicon_url: formData.faviconUrl,
        embedded_mode_enabled: formData.embeddedMode,
        embedded_token: crypto.randomUUID(),
      })
      .eq('id', agencyId);
  }
  
  // Mark onboarding complete
  await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id);
  
  revalidatePath('/dashboard');
  return { success: true };
}
