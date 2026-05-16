import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  backTo?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, showLogo, backTo, action }: AppHeaderProps) {
  const { user, initial } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-3 safe-top">
      {backTo && (
        <Link to={backTo as "/"} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}

      {showLogo && (
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-display text-base font-semibold">VeriCloset</span>
        </Link>
      )}

      {title && <h1 className="font-display text-base font-semibold flex-1">{title}</h1>}

      <div className="ml-auto flex items-center gap-2">
        {action}
        {showLogo && user && (
          <>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <Link to="/settings" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {initial}
            </Link>
          </>
        )}
        {showLogo && !user && (
          <Link to="/auth/login" className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
