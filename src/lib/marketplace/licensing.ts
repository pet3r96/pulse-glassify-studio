export interface LicenseData {
  id: string
  user_id: string
  item_id: string
  item_name: string
  license_type: 'single' | 'unlimited' | 'commercial'
  purchase_date: string
  expires_at?: string
  download_count: number
  max_downloads?: number
  is_active: boolean
  purchase_price: number
  currency: string
}

export interface DownloadData {
  id: string
  license_id: string
  downloaded_at: string
  ip_address: string
  user_agent: string
  file_type: 'theme' | 'component' | 'template'
  file_size: number
}

export interface ThemeFile {
  id: string
  name: string
  type: 'css' | 'js' | 'html' | 'assets'
  content: string
  size: number
  checksum: string
}

// Generate a unique license key
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
    if (i === 3 || i === 7 || i === 11) {
      result += '-'
    }
  }
  return result
}

// Validate a license key format
export function validateLicenseKey(licenseKey: string): boolean {
  const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
  return pattern.test(licenseKey)
}

// Check if a license is valid and active
export function isLicenseValid(license: LicenseData): boolean {
  if (!license.is_active) return false
  
  // Check expiration date
  if (license.expires_at) {
    const now = new Date()
    const expiresAt = new Date(license.expires_at)
    if (now > expiresAt) return false
  }
  
  // Check download limit
  if (license.max_downloads && license.download_count >= license.max_downloads) {
    return false
  }
  
  return true
}

// Check if user can download the item
export function canDownloadItem(
  userId: string, 
  itemId: string, 
  licenses: LicenseData[]
): { canDownload: boolean; reason?: string; license?: LicenseData } {
  const userLicenses = licenses.filter(license => 
    license.user_id === userId && 
    license.item_id === itemId
  )
  
  if (userLicenses.length === 0) {
    return { canDownload: false, reason: 'No license found for this item' }
  }
  
  const activeLicense = userLicenses.find(license => isLicenseValid(license))
  
  if (!activeLicense) {
    return { canDownload: false, reason: 'No active license found' }
  }
  
  return { canDownload: true, license: activeLicense }
}

// Record a download
export function recordDownload(
  licenseId: string,
  ipAddress: string,
  userAgent: string,
  fileType: string,
  fileSize: number
): DownloadData {
  return {
    id: generateLicenseKey(), // Using same function for download ID
    license_id: licenseId,
    downloaded_at: new Date().toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
    file_type: fileType as any,
    file_size: fileSize
  }
}

// Get license summary for user
export function getLicenseSummary(licenses: LicenseData[]) {
  const activeLicenses = licenses.filter(license => isLicenseValid(license))
  const expiredLicenses = licenses.filter(license => 
    license.expires_at && new Date(license.expires_at) < new Date()
  )
  const totalSpent = licenses.reduce((sum, license) => sum + license.purchase_price, 0)
  
  return {
    total_licenses: licenses.length,
    active_licenses: activeLicenses.length,
    expired_licenses: expiredLicenses.length,
    total_spent: totalSpent,
    recent_purchases: licenses
      .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
      .slice(0, 5)
  }
}

// Generate download URL with license validation
export function generateDownloadUrl(
  itemId: string,
  licenseKey: string,
  fileType: string = 'zip'
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/api/download/${itemId}?license=${licenseKey}&type=${fileType}`
}

// Validate download request
export function validateDownloadRequest(
  itemId: string,
  licenseKey: string,
  ipAddress: string,
  userAgent: string
): { valid: boolean; reason?: string } {
  // Validate license key format
  if (!validateLicenseKey(licenseKey)) {
    return { valid: false, reason: 'Invalid license key format' }
  }
  
  // In a real implementation, you would:
  // 1. Look up the license in the database
  // 2. Verify the license is valid and active
  // 3. Check if the user has permission to download
  // 4. Validate IP address and user agent if needed
  
  return { valid: true }
}

// Get license types and their features
export function getLicenseTypes() {
  return [
    {
      id: 'single',
      name: 'Single Use',
      description: 'Use for one project only',
      price_multiplier: 1.0,
      max_downloads: 1,
      commercial_use: false,
      features: [
        'One-time download',
        'Personal use only',
        'No redistribution',
        'Email support'
      ]
    },
    {
      id: 'unlimited',
      name: 'Unlimited Use',
      description: 'Use for unlimited personal projects',
      price_multiplier: 2.5,
      max_downloads: null,
      commercial_use: false,
      features: [
        'Unlimited downloads',
        'Personal use only',
        'No redistribution',
        'Priority support',
        'Updates included'
      ]
    },
    {
      id: 'commercial',
      name: 'Commercial License',
      description: 'Use for commercial projects and client work',
      price_multiplier: 5.0,
      max_downloads: null,
      commercial_use: true,
      features: [
        'Unlimited downloads',
        'Commercial use allowed',
        'Client work included',
        'Priority support',
        'Updates included',
        'Resale rights'
      ]
    }
  ]
}

// Calculate license price
export function calculateLicensePrice(
  basePrice: number,
  licenseType: string,
  currency: string = 'USD'
): number {
  const licenseTypes = getLicenseTypes()
  const license = licenseTypes.find(l => l.id === licenseType)
  
  if (!license) {
    throw new Error('Invalid license type')
  }
  
  return Math.round(basePrice * license.price_multiplier * 100) / 100
}

// Generate license agreement text
export function generateLicenseAgreement(
  itemName: string,
  licenseType: string,
  authorName: string
): string {
  const licenseTypes = getLicenseTypes()
  const license = licenseTypes.find(l => l.id === licenseType)
  
  if (!license) {
    throw new Error('Invalid license type')
  }
  
  return `
LICENSE AGREEMENT

Item: ${itemName}
Author: ${authorName}
License Type: ${license.name}
Date: ${new Date().toLocaleDateString()}

TERMS AND CONDITIONS:

1. GRANT OF LICENSE
   This license grants you the right to use the above-mentioned item according to the terms specified.

2. PERMITTED USES
   ${license.commercial_use ? 'Commercial use is permitted.' : 'Personal use only.'}
   ${license.max_downloads ? `Maximum ${license.max_downloads} download(s) allowed.` : 'Unlimited downloads allowed.'}

3. RESTRICTIONS
   - You may not redistribute, resell, or sublicense this item
   - You may not claim ownership of this item
   - You may not reverse engineer or decompile this item

4. SUPPORT
   ${license.features.includes('Priority support') ? 'Priority support is included.' : 'Basic email support is included.'}

5. UPDATES
   ${license.features.includes('Updates included') ? 'Updates are included with this license.' : 'Updates are not included.'}

6. TERMINATION
   This license is effective until terminated. You may terminate it at any time by destroying all copies of the item.

By downloading this item, you agree to be bound by the terms of this license agreement.
  `.trim()
}
