'use client';

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface StepEmbeddedModeProps {
  embeddedMode: boolean;
  onUpdate: (data: { embeddedMode: boolean }) => void;
}

export function StepEmbeddedMode({ embeddedMode, onUpdate }: StepEmbeddedModeProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl mb-2">Embedded Mode</h3>
        <p className="text-sm text-muted-foreground">
          Enable embedded mode to inject themes directly into GoHighLevel
        </p>
      </div>

      <div className="flex items-center justify-between glass-card p-4">
        <div className="space-y-0.5">
          <Label htmlFor="embedded-mode">Enable Embedded Mode</Label>
          <p className="text-sm text-muted-foreground">
            Automatically apply themes to your GHL interface
          </p>
        </div>
        <Switch
          id="embedded-mode"
          checked={embeddedMode}
          onCheckedChange={(checked) => onUpdate({ embeddedMode: checked })}
        />
      </div>

      {embeddedMode && (
        <div className="glass-card p-4 mt-4">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Installation Code:</strong>
          </p>
          <code className="text-xs bg-black/20 p-2 rounded block overflow-x-auto">
            {`<!-- Add this to your GHL Custom Code -->
<script src="https://pulsegen-studio.vercel.app/embed.js"></script>`}
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Your unique token will be generated after setup
          </p>
        </div>
      )}

      <div className="glass-card p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> You can enable or disable this later in Settings
        </p>
      </div>
    </div>
  );
}
