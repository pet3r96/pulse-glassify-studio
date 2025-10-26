'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StepBrandingProps {
  logoUrl: string;
  faviconUrl: string;
  onUpdate: (data: { logoUrl?: string; faviconUrl?: string }) => void;
}

export function StepBranding({ logoUrl, faviconUrl, onUpdate }: StepBrandingProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl mb-2">Branding Assets</h3>
        <p className="text-sm text-muted-foreground">
          Upload your logo and favicon (optional - can be added later)
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <Input
            id="logo"
            type="url"
            value={logoUrl}
            onChange={(e) => onUpdate({ logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="glass"
          />
          <p className="text-xs text-muted-foreground">
            Enter the URL of your logo image
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="favicon">Favicon URL</Label>
          <Input
            id="favicon"
            type="url"
            value={faviconUrl}
            onChange={(e) => onUpdate({ faviconUrl: e.target.value })}
            placeholder="https://example.com/favicon.ico"
            className="glass"
          />
          <p className="text-xs text-muted-foreground">
            Enter the URL of your favicon (16x16 or 32x32 pixels)
          </p>
        </div>
      </div>

      <div className="glass-card p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> You can skip this step and add branding later in Settings
        </p>
      </div>
    </div>
  );
}
