import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { themeId, subaccountId } = await request.json();

    if (!themeId) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    // Get the theme and its active version
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select(`
        *,
        theme_versions!inner(
          css_code,
          js_code,
          version_number,
          is_active
        )
      `)
      .eq('id', themeId)
      .eq('owner_id', user.id)
      .eq('theme_versions.is_active', true)
      .single();

    if (themeError || !theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    // Generate deployment script
    const deploymentScript = generateDeploymentScript(theme.theme_versions[0]);

    // In a real implementation, this would:
    // 1. Send the CSS/JS to GHL via webhook
    // 2. Update the subaccount's active theme
    // 3. Log the deployment

    // For now, we'll simulate deployment
    const deployment = {
      id: `deploy_${Date.now()}`,
      themeId,
      subaccountId: subaccountId || user.user_metadata?.subaccount_id,
      status: 'deployed',
      deployedAt: new Date().toISOString(),
      script: deploymentScript,
    };

    return NextResponse.json({
      success: true,
      deployment,
      message: 'Theme deployed successfully',
    });
  } catch (error) {
    console.error('Theme deployment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateDeploymentScript(version: any) {
  return `
// PulseGen Studio Theme Deployment Script
// Generated: ${new Date().toISOString()}

(function() {
  'use strict';
  
  // Remove existing PulseGen theme
  const existingStyle = document.getElementById('pulsegen-theme');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const existingScript = document.getElementById('pulsegen-script');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Inject CSS
  const style = document.createElement('style');
  style.id = 'pulsegen-theme';
  style.textContent = \`${version.css_code.replace(/`/g, '\\`')}\`;
  document.head.appendChild(style);
  
  // Inject JavaScript
  if ('${version.js_code}') {
    const script = document.createElement('script');
    script.id = 'pulsegen-script';
    script.textContent = \`${version.js_code.replace(/`/g, '\\`')}\`;
    document.head.appendChild(script);
  }
  
  console.log('PulseGen Studio theme deployed successfully');
})();
`;
}
