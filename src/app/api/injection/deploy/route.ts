import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { communicationManager } from '@/lib/injection/communication-manager';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { themeId, connectionId, deploymentType } = await request.json();

    if (!themeId || !connectionId) {
      return NextResponse.json({ 
        error: 'Theme ID and Connection ID are required' 
      }, { status: 400 });
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

    const activeVersion = theme.theme_versions[0];
    const themeData = {
      id: theme.id,
      name: theme.name,
      css: activeVersion.css_code,
      js: activeVersion.js_code,
      version: activeVersion.version_number,
      metadata: theme.metadata,
      deployedAt: new Date().toISOString(),
    };

    // Deploy based on deployment type
    let deploymentResult;
    
    switch (deploymentType) {
      case 'injection':
        // Use the injection system
        deploymentResult = await deployViaInjection(connectionId, themeData);
        break;
        
      case 'webhook':
        // Use webhook deployment (for future implementation)
        deploymentResult = await deployViaWebhook(connectionId, themeData);
        break;
        
      case 'manual':
        // Generate manual deployment code
        deploymentResult = await generateManualDeployment(themeData);
        break;
        
      default:
        return NextResponse.json({ 
          error: 'Invalid deployment type' 
        }, { status: 400 });
    }

    // Log the deployment
    await logDeployment(user.id, themeId, connectionId, deploymentType, deploymentResult);

    return NextResponse.json({
      success: true,
      deployment: deploymentResult,
      theme: themeData,
      message: 'Theme deployed successfully',
    });
  } catch (error) {
    console.error('Theme deployment error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

async function deployViaInjection(connectionId: string, themeData: any) {
  try {
    const success = await communicationManager.sendThemeUpdate(connectionId, themeData);
    
    if (success) {
      return {
        method: 'injection',
        status: 'deployed',
        connectionId,
        deployedAt: new Date().toISOString(),
        message: 'Theme deployed via injection system',
      };
    } else {
      throw new Error('Failed to deploy via injection');
    }
  } catch (error) {
    console.error('Injection deployment error:', error);
    throw error;
  }
}

async function deployViaWebhook(connectionId: string, themeData: any) {
  // This would integrate with GHL webhooks in a real implementation
  // For now, we'll simulate it
  return {
    method: 'webhook',
    status: 'simulated',
    connectionId,
    deployedAt: new Date().toISOString(),
    message: 'Webhook deployment simulated (not implemented yet)',
  };
}

async function generateManualDeployment(themeData: any) {
  const deploymentScript = `
// PulseGen Studio Manual Theme Deployment
// Generated: ${new Date().toISOString()}

(function() {
  'use strict';
  
  // Remove existing PulseGen theme
  const existingStyle = document.getElementById('pulsegen-theme');
  if (existingStyle) existingStyle.remove();
  
  const existingScript = document.getElementById('pulsegen-script');
  if (existingScript) existingScript.remove();
  
  // Inject CSS
  const style = document.createElement('style');
  style.id = 'pulsegen-theme';
  style.setAttribute('data-theme-id', '${themeData.id}');
  style.setAttribute('data-version', '${themeData.version}');
  style.textContent = \`${themeData.css.replace(/`/g, '\\`')}\`;
  document.head.appendChild(style);
  
  // Inject JavaScript
  if ('${themeData.js}') {
    const script = document.createElement('script');
    script.id = 'pulsegen-script';
    script.setAttribute('data-theme-id', '${themeData.id}');
    script.setAttribute('data-version', '${themeData.version}');
    script.textContent = \`${themeData.js.replace(/`/g, '\\`')}\`;
    document.head.appendChild(script);
  }
  
  console.log('PulseGen Studio theme deployed: ${themeData.name}');
})();
`;

  return {
    method: 'manual',
    status: 'generated',
    script: deploymentScript,
    instructions: [
      'Copy the generated script',
      'Go to GoHighLevel Settings → Custom Code',
      'Paste the script in the Footer Code section',
      'Save and refresh your dashboard',
    ],
    deployedAt: new Date().toISOString(),
    message: 'Manual deployment script generated',
  };
}

async function logDeployment(
  userId: string, 
  themeId: string, 
  connectionId: string, 
  deploymentType: string, 
  result: any
) {
  try {
    const supabase = createClient();
    
    // In a real implementation, you would have a deployments table
    // For now, we'll just log to console
    console.log('Deployment logged:', {
      userId,
      themeId,
      connectionId,
      deploymentType,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging deployment:', error);
  }
}
