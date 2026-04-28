import { Link } from "@tanstack/react-router";
import { ShieldCheck, Bell, Heart } from "lucide-react";

export function AppHeader({ title, showLogo = false }: { title?: string; showLogo?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur safe-top">
      <div className="flex h-14 items-center justify-between px-4">
        {showLogo ? (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">VeriCloset</span>
          </Link>
        ) : (
          <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>
        )}
        <div className="flex items-center gap-1">
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
            <Heart className="h-5 w-5" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
