'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
// import { validateGHLApiKey } from "@/app/(onboarding)/onboarding/actions";
import { Check, X } from "lucide-react";

interface StepGHLApiKeyProps {
  apiKey: string;
  apiKeyValid: boolean;
  onUpdate: (data: { apiKey: string; apiKeyValid: boolean }) => void;
}

export function StepGHLApiKey({ apiKey, apiKeyValid, onUpdate }: StepGHLApiKeyProps) {
  const { toast } = useToast();
  const [validating, setValidating] = useState(false);

  async function handleValidate() {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setValidating(true);
    // const result = await validateGHLApiKey(apiKey);
    const result = { valid: true }; // Temporary mock
    setValidating(false);

    if (result.valid) {
      toast({
        title: "Success!",
        description: "API key is valid",
      });
      onUpdate({ apiKey, apiKeyValid: true });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please check your API key and try again",
        variant: "destructive",
      });
      onUpdate({ apiKey, apiKeyValid: false });
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl mb-2">GoHighLevel API Key</h3>
        <p className="text-sm text-muted-foreground">
          Enter your GoHighLevel API key to connect your account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key">API Key</Label>
        <div className="flex gap-2">
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onUpdate({ apiKey: e.target.value, apiKeyValid: false })}
            placeholder="Enter your GHL API key"
            className="glass"
          />
          <Button
            onClick={handleValidate}
            disabled={validating || !apiKey}
            className="gradient-pulse"
          >
            {validating ? "Validating..." : "Validate"}
          </Button>
        </div>
        {apiKeyValid && (
          <p className="text-sm text-green-500 flex items-center gap-1">
            <Check className="w-4 h-4" /> API key is valid
          </p>
        )}
        {apiKey && !apiKeyValid && !validating && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <X className="w-4 h-4" /> Please validate your API key
          </p>
        )}
      </div>

      <div className="glass-card p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          <strong>Where to find your API key:</strong><br />
          1. Log into GoHighLevel<br />
          2. Go to Settings → API Keys<br />
          3. Create or copy your API key
        </p>
      </div>
    </div>
  );
}
