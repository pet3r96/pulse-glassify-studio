import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/pulsegen-logo.png";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="group-hover:scale-110 transition-transform">
              <img src={logo} alt="PulseGen Media" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-heading text-xl gradient-text">PulseStudio</h1>
              <p className="text-[10px] text-muted-foreground">by PulseGen Media</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="gradient-pulse hover-glow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
