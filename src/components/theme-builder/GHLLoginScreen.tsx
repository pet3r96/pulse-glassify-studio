import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface GHLLoginScreenProps {
  colors: ThemeColors;
  fonts: ThemeFonts;
}

export const GHLLoginScreen = ({ colors, fonts }: GHLLoginScreenProps) => {
  const style = {
    '--ghl-primary': colors.primary,
    '--ghl-secondary': colors.secondary,
    '--ghl-accent': colors.accent,
    '--ghl-background': colors.background,
    '--ghl-sidebar': colors.sidebar,
    '--ghl-text': colors.text,
    '--ghl-heading-font': fonts.heading,
    '--ghl-body-font': fonts.body,
  } as React.CSSProperties;

  return (
    <div className="h-full w-full flex items-center justify-center p-8" style={{ ...style, background: colors.background }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: colors.primary }}>
            <Lock className="w-8 h-8" style={{ color: colors.text }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text, fontFamily: fonts.heading }}>
            Welcome Back
          </h1>
          <p className="text-sm opacity-80" style={{ color: colors.text, fontFamily: fonts.body }}>
            Sign in to your GoHighLevel account
          </p>
        </div>

        <div className="rounded-lg p-8 space-y-6" style={{ background: colors.sidebar }}>
          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text, fontFamily: fonts.body }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: colors.text }} />
              <Input 
                type="email" 
                placeholder="you@example.com"
                className="pl-10 border-0"
                style={{ background: colors.background, color: colors.text, fontFamily: fonts.body }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" style={{ color: colors.text, fontFamily: fonts.body }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: colors.text }} />
              <Input 
                type="password" 
                placeholder="••••••••"
                className="pl-10 border-0"
                style={{ background: colors.background, color: colors.text, fontFamily: fonts.body }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm" style={{ color: colors.text, fontFamily: fonts.body }}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline opacity-80">
              Forgot password?
            </a>
          </div>

          <Button 
            className="w-full h-12 text-base font-semibold"
            style={{ 
              background: colors.primary, 
              color: colors.text,
              fontFamily: fonts.body
            }}
          >
            Sign In
          </Button>

          <div className="text-center text-sm opacity-80" style={{ color: colors.text, fontFamily: fonts.body }}>
            Don't have an account? <a href="#" className="font-medium hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};
