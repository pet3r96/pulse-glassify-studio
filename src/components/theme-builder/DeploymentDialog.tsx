import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeploymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deploymentCode: string;
}

export const DeploymentDialog = ({ open, onOpenChange, deploymentCode }: DeploymentDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deploymentCode);
      setCopied(true);
      toast({
        title: "Code copied!",
        description: "Theme code has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Deploy Your Theme to GoHighLevel</DialogTitle>
          <DialogDescription>
            Follow these steps to apply your theme to your GHL account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h3 className="font-semibold text-sm">Deployment Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Copy the code below (click the Copy button)</li>
              <li>Open your GoHighLevel account</li>
              <li>Navigate to: <strong>Settings → Business Profile → Custom Code</strong></li>
              <li>Paste the code in the <strong>"Footer Tracking Code"</strong> section</li>
              <li>Click <strong>Save</strong></li>
              <li>Refresh your GHL dashboard to see the theme applied!</li>
            </ol>
          </div>

          {/* Code Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Theme Deployment Code</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={deploymentCode}
              readOnly
              className="font-mono text-xs h-64 resize-none"
            />
          </div>

          {/* Help Link */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="font-medium text-sm">Need help deploying?</p>
              <p className="text-xs text-muted-foreground">
                Check out our step-by-step guide with screenshots
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="https://help.gohighlevel.com" target="_blank" rel="noopener noreferrer">
                View Guide
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
