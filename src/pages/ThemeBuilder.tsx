import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import GHLMockDashboard from "@/components/theme-builder/GHLMockDashboard";

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

const ThemeBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [themeName, setThemeName] = useState("");
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#ec4899",
    secondary: "#a855f7",
    accent: "#3b82f6",
    background: "#0F172A",
    sidebar: "#1e293b",
    text: "#ffffff",
  });
  const [fonts, setFonts] = useState<ThemeFonts>({
    heading: "Inter",
    body: "Inter",
  });
  const [customCSS, setCustomCSS] = useState("");
  const [customJS, setCustomJS] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors({ ...colors, [key]: value });
  };

  const handleSaveTheme = async () => {
    if (!themeName.trim()) {
      toast({
        title: "Theme name required",
        description: "Please enter a name for your theme",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single();

      if (!profile?.agency_id) {
        toast({
          title: "Agency required",
          description: "You must be part of an agency to create themes",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("themes").insert([{
        name: themeName,
        agency_id: profile.agency_id,
        colors: colors as any,
        fonts: fonts as any,
        css: customCSS,
        js: customJS,
      }]);

      if (error) throw error;

      toast({
        title: "Theme saved",
        description: "Your theme has been created successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving theme:", error);
      toast({
        title: "Error",
        description: "Failed to save theme",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Theme Builder</h1>
              <p className="text-sm text-muted-foreground">
                Design your custom GHL theme
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSaveTheme} disabled={isSaving} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Theme"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-3">
          <Card className="p-6 glass-card">
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  placeholder="My Awesome Theme"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="fonts">Fonts</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4 mt-4">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key} className="capitalize">
                      {key}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={key}
                        type="color"
                        value={value}
                        onChange={(e) =>
                          handleColorChange(key as keyof ThemeColors, e.target.value)
                        }
                        className="w-16 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleColorChange(key as keyof ThemeColors, e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="fonts" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <Input
                    id="heading-font"
                    value={fonts.heading}
                    onChange={(e) =>
                      setFonts({ ...fonts, heading: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="body-font">Body Font</Label>
                  <Input
                    id="body-font"
                    value={fonts.body}
                    onChange={(e) =>
                      setFonts({ ...fonts, body: e.target.value })
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea
                    id="custom-css"
                    placeholder="/* Add your custom CSS */"
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    className="font-mono text-sm min-h-[150px]"
                  />
                </div>
                <div>
                  <Label htmlFor="custom-js">Custom JavaScript</Label>
                  <Textarea
                    id="custom-js"
                    placeholder="// Add your custom JS"
                    value={customJS}
                    onChange={(e) => setCustomJS(e.target.value)}
                    className="font-mono text-sm min-h-[150px]"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Center - Preview */}
        <div className="lg:col-span-9">
          <Card className="p-6 glass-card">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <p className="text-sm text-muted-foreground">
                See your changes in real-time
              </p>
            </div>
            <div className="border rounded-lg overflow-hidden bg-background">
              <GHLMockDashboard colors={colors} fonts={fonts} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThemeBuilder;
