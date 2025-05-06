import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatedTransition } from "./AnimatedTransition";
import { cn } from "@/lib/utils";
import { Crown, Home, Settings, Printer, Image, PaintBucket } from "lucide-react";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const location = useLocation();
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/30">
      <header className="w-full py-4 px-6 md:px-8 border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-king-600 text-white p-1.5 rounded-md shadow-lg group-hover:shadow-king-300/50 transition-all duration-300">
              <Crown size={24} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-king-800 to-king-600">Color King</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={<Home size={18} />} label="Home" active={location.pathname === "/"} />
            <NavLink to="/create" icon={<Image size={18} />} label="Create" active={location.pathname.startsWith("/create")} />
            <NavLink to="/print" icon={<Printer size={18} />} label="Print" active={location.pathname.startsWith("/print")} />
          </nav>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <AnimatedTransition>
          {children}
        </AnimatedTransition>
      </main>
      
      <footer className="w-full py-6 px-4 border-t border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} King of Colors. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
      
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/40 py-3 px-6 z-50">
        <div className="flex items-center justify-around">
          <MobileNavLink to="/" icon={<Home size={20} />} active={location.pathname === "/"} />
          <MobileNavLink to="/create" icon={<Image size={20} />} active={location.pathname.startsWith("/create")} />
          <MobileNavLink to="/print" icon={<Printer size={20} />} active={location.pathname.startsWith("/print")} />
          <MobileNavLink to="/preview" icon={<PaintBucket size={20} />} active={location.pathname.startsWith("/preview")} />
        </div>
      </nav>
    </div>;
};
interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}
const NavLink: React.FC<NavLinkProps> = ({
  to,
  label,
  icon,
  active
}) => {
  return <Link to={to} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200", active ? "text-king-700 bg-king-50" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
      {icon}
      {label}
    </Link>;
};
interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  active: boolean;
}
const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  icon,
  active
}) => {
  return <Link to={to} className={cn("flex items-center justify-center p-2 rounded-md transition-all duration-200", active ? "text-king-600 bg-king-50" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
      {icon}
    </Link>;
};
export default Layout;