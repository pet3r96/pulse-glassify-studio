'use client';

interface StepThemeSelectionProps {
  selectedTheme: string | null;
  onUpdate: (data: { selectedTheme: string | null }) => void;
}

export function StepThemeSelection({ selectedTheme, onUpdate }: StepThemeSelectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl mb-2">Choose a Theme</h3>
        <p className="text-sm text-muted-foreground">
          Select a pre-made theme or create your own later
        </p>
      </div>

      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">🎨</div>
        <h4 className="font-heading text-lg mb-2">Marketplace Coming Soon</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Browse and purchase professional themes from our marketplace
        </p>
        <p className="text-xs text-muted-foreground">
          For now, you can create custom themes in the Theme Studio
        </p>
      </div>
    </div>
  );
}
