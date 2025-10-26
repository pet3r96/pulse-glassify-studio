export interface EmbedToken {
  id: string
  agency_id: string
  token: string
  expires_at: string
  permissions: string[]
  is_active: boolean
  created_at: string
  last_used?: string
  usage_count: number
  max_usage?: number
}

export interface EmbedConfig {
  agency_id: string
  theme_id?: string
  modules: {
    theme_studio: boolean
    marketplace: boolean
    task_manager: boolean
    support: boolean
    analytics: boolean
  }
  custom_css?: string
  custom_js?: string
  branding: {
    logo_url?: string
    primary_color?: string
    secondary_color?: string
  }
  security: {
    allowed_domains: string[]
    require_https: boolean
    ip_whitelist?: string[]
  }
}

export interface EmbedLog {
  id: string
  token_id: string
  agency_id: string
  action: string
  details: any
  ip_address: string
  user_agent: string
  timestamp: string
  success: boolean
  error_message?: string
}

export interface EmbedAnalytics {
  token_id: string
  agency_id: string
  page_views: number
  unique_visitors: number
  actions_performed: number
  errors_count: number
  avg_session_duration: number
  last_activity: string
  created_at: string
}

// Generate a secure embed token
export function generateEmbedToken(agencyId: string, permissions: string[] = []): EmbedToken {
  const token = generateSecureToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

  return {
    id: generateId(),
    agency_id: agencyId,
    token,
    expires_at: expiresAt.toISOString(),
    permissions: permissions.length > 0 ? permissions : ['read', 'write'],
    is_active: true,
    created_at: new Date().toISOString(),
    usage_count: 0
  }
}

// Validate an embed token
export function validateEmbedToken(token: string): { valid: boolean; token?: EmbedToken; error?: string } {
  try {
    // In real implementation, this would validate against the database
    // For now, we'll simulate validation
    const mockToken: EmbedToken = {
      id: 'token-1',
      agency_id: 'agency-1',
      token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['read', 'write'],
      is_active: true,
      created_at: new Date().toISOString(),
      usage_count: 0
    }

    if (!mockToken.is_active) {
      return { valid: false, error: 'Token is inactive' }
    }

    if (new Date(mockToken.expires_at) < new Date()) {
      return { valid: false, error: 'Token has expired' }
    }

    return { valid: true, token: mockToken }
  } catch (error) {
    return { valid: false, error: 'Invalid token format' }
  }
}

// Generate embed URL
export function generateEmbedUrl(token: string, path: string = '', config?: Partial<EmbedConfig>): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const embedUrl = new URL(`${baseUrl}/embed/${path}`)
  
  embedUrl.searchParams.set('token', token)
  
  if (config) {
    embedUrl.searchParams.set('config', JSON.stringify(config))
  }
  
  return embedUrl.toString()
}

// Create signed embed URL with expiration
export function createSignedEmbedUrl(
  agencyId: string,
  path: string,
  expiresInMinutes: number = 60,
  permissions: string[] = []
): { url: string; token: string; expires_at: string } {
  const token = generateEmbedToken(agencyId, permissions)
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  
  // In real implementation, this would be signed with a secret key
  const signedToken = btoa(JSON.stringify({
    token: token.token,
    agency_id: agencyId,
    expires_at: expiresAt.toISOString(),
    permissions
  }))
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${baseUrl}/embed/${path}?signed=${signedToken}`
  
  return {
    url,
    token: token.token,
    expires_at: expiresAt.toISOString()
  }
}

// Log embed activity
export function logEmbedActivity(
  tokenId: string,
  agencyId: string,
  action: string,
  details: any,
  ipAddress: string,
  userAgent: string,
  success: boolean = true,
  errorMessage?: string
): EmbedLog {
  return {
    id: generateId(),
    token_id: tokenId,
    agency_id: agencyId,
    action,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
    timestamp: new Date().toISOString(),
    success,
    error_message: errorMessage
  }
}

// Get embed analytics
export function getEmbedAnalytics(tokenId: string, agencyId: string): EmbedAnalytics {
  // In real implementation, this would fetch from database
  return {
    token_id: tokenId,
    agency_id: agencyId,
    page_views: 1250,
    unique_visitors: 45,
    actions_performed: 320,
    errors_count: 12,
    avg_session_duration: 1800, // 30 minutes in seconds
    last_activity: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
}

// Check if domain is allowed
export function isDomainAllowed(domain: string, allowedDomains: string[]): boolean {
  if (allowedDomains.length === 0) return true
  
  return allowedDomains.some(allowedDomain => {
    if (allowedDomain.startsWith('*.')) {
      const baseDomain = allowedDomain.substring(2)
      return domain.endsWith(baseDomain)
    }
    return domain === allowedDomain
  })
}

// Validate embed request
export function validateEmbedRequest(
  token: string,
  domain: string,
  ipAddress: string,
  config?: EmbedConfig
): { valid: boolean; error?: string; token?: EmbedToken } {
  const validation = validateEmbedToken(token)
  
  if (!validation.valid) {
    return validation
  }
  
  const embedToken = validation.token!
  
  // Check domain restrictions
  if (config?.security?.allowed_domains) {
    if (!isDomainAllowed(domain, config.security.allowed_domains)) {
      return { valid: false, error: 'Domain not allowed' }
    }
  }
  
  // Check IP whitelist
  if (config?.security?.ip_whitelist) {
    if (!config.security.ip_whitelist.includes(ipAddress)) {
      return { valid: false, error: 'IP address not allowed' }
    }
  }
  
  // Check HTTPS requirement
  if (config?.security?.require_https && !domain.startsWith('https://')) {
    return { valid: false, error: 'HTTPS required' }
  }
  
  return { valid: true, token: embedToken }
}

// Generate embed snippet for GoHighLevel
export function generateEmbedSnippet(agencyId: string, config?: Partial<EmbedConfig>): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const embedUrl = `${baseUrl}/embed/loader.js`
  
  return `
<!-- PulseGen Studio Embed Snippet -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${embedUrl}';
    script.async = true;
    script.onload = function() {
      PulseGenEmbed.init({
        agencyId: '${agencyId}',
        baseUrl: '${baseUrl}',
        config: ${JSON.stringify(config || {})},
        container: 'pulsegen-embed-container'
      });
    };
    document.head.appendChild(script);
  })();
</script>
<div id="pulsegen-embed-container"></div>
  `.trim()
}

// Generate CSS injection snippet
export function generateCSSInjectionSnippet(css: string): string {
  return `
<!-- PulseGen Studio CSS Injection -->
<script>
  (function() {
    var style = document.createElement('style');
    style.id = 'pulsegen-theme-css';
    style.textContent = \`${css}\`;
    document.head.appendChild(style);
  })();
</script>
  `.trim()
}

// Generate JS injection snippet
export function generateJSInjectionSnippet(js: string): string {
  return `
<!-- PulseGen Studio JS Injection -->
<script>
  (function() {
    try {
      ${js}
    } catch (error) {
      console.error('PulseGen Studio JS Error:', error);
    }
  })();
</script>
  `.trim()
}

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Module enable/disable management
export function updateModuleStatus(
  agencyId: string,
  module: keyof EmbedConfig['modules'],
  enabled: boolean
): EmbedConfig {
  // In real implementation, this would update the database
  return {
    agency_id: agencyId,
    modules: {
      theme_studio: module === 'theme_studio' ? enabled : true,
      marketplace: module === 'marketplace' ? enabled : true,
      task_manager: module === 'task_manager' ? enabled : true,
      support: module === 'support' ? enabled : true,
      analytics: module === 'analytics' ? enabled : true
    },
    security: {
      allowed_domains: [],
      require_https: false
    }
  }
}

// Get module status
export function getModuleStatus(agencyId: string, module: keyof EmbedConfig['modules']): boolean {
  // In real implementation, this would fetch from database
  return true
}

// Analytics tracking
export function trackEmbedEvent(
  tokenId: string,
  agencyId: string,
  event: string,
  properties: any = {}
): void {
  // In real implementation, this would send to analytics service
  console.log('Embed Event:', { tokenId, agencyId, event, properties })
}

// Error handling
export function handleEmbedError(
  tokenId: string,
  agencyId: string,
  error: Error,
  context: string
): void {
  const errorLog = logEmbedActivity(
    tokenId,
    agencyId,
    'error',
    { error: error.message, context },
    'unknown',
    'unknown',
    false,
    error.message
  )
  
  // In real implementation, this would save to database
  console.error('Embed Error:', errorLog)
}
