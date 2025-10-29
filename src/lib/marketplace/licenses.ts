export function generateLicenseKey(prefix: string = 'LIC'): string {
  const rand = () => Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${prefix}-${rand()}-${rand()}-${rand()}`;
}

export function isLicenseValid(license: any): { valid: boolean; reason?: string } {
  const now = Date.now();
  if (license.expires_at && new Date(license.expires_at).getTime() < now) {
    return { valid: false, reason: 'expired' };
  }
  if (license.download_limit != null && license.downloads_used >= license.download_limit) {
    return { valid: false, reason: 'limit' };
  }
  return { valid: true };
}


