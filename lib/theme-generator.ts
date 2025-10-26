interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  sidebar: string;
  text: string;
}

interface ThemeFonts {
  heading: string;
  body: string;
}

interface Theme {
  colors: ThemeColors;
  fonts?: ThemeFonts;
  css?: string;
  js?: string;
}

export function generateThemeCSS(theme: Theme): string {
  const { colors, fonts } = theme;
  
  return `
/* PulseGen Studio Theme */
:root {
  --primary-color: ${colors.primary};
  --secondary-color: ${colors.secondary};
  --accent-color: ${colors.accent};
  --background-color: ${colors.background};
  --sidebar-color: ${colors.sidebar};
  --text-color: ${colors.text};
  ${fonts ? `
  --font-heading: ${fonts.heading};
  --font-body: ${fonts.body};
  ` : ''}
}

body {
  background-color: var(--background-color) !important;
  color: var(--text-color) !important;
  ${fonts ? `font-family: var(--font-body) !important;` : ''}
}

h1, h2, h3, h4, h5, h6 {
  ${fonts ? `font-family: var(--font-heading) !important;` : ''}
}

.sidebar, [class*="sidebar"] {
  background-color: var(--sidebar-color) !important;
}

.btn-primary, button[class*="primary"] {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.btn-secondary, button[class*="secondary"] {
  background-color: var(--secondary-color) !important;
  border-color: var(--secondary-color) !important;
}

a, .link, [class*="accent"] {
  color: var(--accent-color) !important;
}

${theme.css || ''}
`.trim();
}

export function generateDeploymentCode(theme: Theme, licenseToken: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pulsegen-studio.vercel.app';
  
  return `
<!-- PulseGen Studio Theme Deployment -->
<style id="pulsegen-theme-css">
  ${generateThemeCSS(theme)}
</style>

<script id="pulsegen-theme-js">
(function() {
  'use strict';
  
  // License validation middleware
  const LICENSE_TOKEN = '${licenseToken}';
  const VALIDATION_ENDPOINT = '${apiUrl}/api/validate-license';
  const CACHE_DURATION = 3600000; // 1 hour
  
  async function validateLicense() {
    const cached = localStorage.getItem('pg_license_valid');
    const cacheTime = localStorage.getItem('pg_license_cache_time');
    
    // Use cache if less than 1 hour old
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION) {
      return cached === 'true';
    }
    
    try {
      const response = await fetch(VALIDATION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: LICENSE_TOKEN })
      });
      
      const result = await response.json();
      
      localStorage.setItem('pg_license_valid', result.valid ? 'true' : 'false');
      localStorage.setItem('pg_license_cache_time', Date.now().toString());
      
      return result.valid;
    } catch (error) {
      console.warn('PulseGen: License validation failed, using grace period');
      // 24-hour grace period on validation failure
      const lastValidation = localStorage.getItem('pg_license_cache_time');
      if (lastValidation && Date.now() - parseInt(lastValidation) < 86400000) {
        return true;
      }
      return false;
    }
  }
  
  // Apply theme if license is valid
  validateLicense().then(valid => {
    if (!valid) {
      console.error('PulseGen: Invalid or expired license. Theme disabled.');
      const themeStyle = document.getElementById('pulsegen-theme-css');
      if (themeStyle) themeStyle.remove();
      return;
    }
    
    // Apply custom theme JavaScript
    ${theme.js || '// No custom JS'}
    
    console.log('PulseGen: Theme applied successfully');
  });
})();
</script>
`.trim();
}

export function generatePluginCode(pluginName: string, config: {
  agencyId: string;
  apiKey: string;
  theme: 'light' | 'dark';
}): string {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pulsegen-studio.vercel.app';
  
  if (pluginName === 'project-manager') {
    return `<!-- PulseGen Project Manager Plugin -->
<script src="${apiUrl}/plugins/project-manager.js"></script>
<script>
  PulseGen.ProjectManager.init({
    agencyId: '${config.agencyId}',
    apiKey: '${config.apiKey}',
    theme: '${config.theme}',
    apiUrl: '${apiUrl}'
  });
</script>`;
  }
  
  if (pluginName === 'global-search') {
    return `<!-- PulseGen Global Search Plugin -->
<script src="${apiUrl}/plugins/global-search.js"></script>
<script>
  PulseGen.GlobalSearch.init({
    agencyId: '${config.agencyId}',
    apiKey: '${config.apiKey}',
    shortcut: 'Cmd+K',
    apiUrl: '${apiUrl}'
  });
</script>`;
  }
  
  return '';
}
