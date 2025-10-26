'use client';

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepBaseThemeProps {
  baseTheme: 'light' | 'dark';
  onUpdate: (data: { baseTheme: 'light' | 'dark' }) => void;
}

export function StepBaseTheme({ baseTheme, onUpdate }: StepBaseThemeProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl mb-2">Base Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred color scheme for the GoHighLevel interface
        </p>
      </div>

      <RadioGroup 
        value={baseTheme} 
        onValueChange={(value) => onUpdate({ baseTheme: value as 'light' | 'dark' })}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label 
              htmlFor="theme-dark" 
              className="cursor-pointer"
            >
              <div className={`glass-card p-6 flex flex-col items-center gap-3 border-2 transition-colors ${baseTheme === 'dark' ? 'border-primary' : 'border-transparent'}`}>
                <RadioGroupItem value="dark" id="theme-dark" />
                <div className="w-full h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-white/10" />
                <span className="font-heading">Dark Theme</span>
                <span className="text-xs text-muted-foreground text-center">
                  Professional and modern
                </span>
              </div>
            </Label>
          </div>

          <div>
            <Label 
              htmlFor="theme-light" 
              className="cursor-pointer"
            >
              <div className={`glass-card p-6 flex flex-col items-center gap-3 border-2 transition-colors ${baseTheme === 'light' ? 'border-primary' : 'border-transparent'}`}>
                <RadioGroupItem value="light" id="theme-light" />
                <div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300" />
                <span className="font-heading">Light Theme</span>
                <span className="text-xs text-muted-foreground text-center">
                  Clean and bright
                </span>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
