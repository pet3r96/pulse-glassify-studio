import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../assets/pulsegen-logo.png";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="group-hover:scale-110 transition-transform">
              <Image src={logo} alt="PulseGen Media" width={40} height={40} />
            </div>
            <div>
              <h1 className="font-heading text-xl gradient-text">PulseStudio</h1>
              <p className="text-[10px] text-muted-foreground">by PulseGen Media</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
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
