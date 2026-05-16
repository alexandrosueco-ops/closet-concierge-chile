import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Bell, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TruekiLogo } from "@/components/TruekiLogo";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  backTo?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, showLogo, backTo, action }: AppHeaderProps) {
  const { user, initial, roles } = useAuth();
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-3 safe-top">
      {backTo && (
        <Link to={backTo as "/"} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}

      {showLogo && <Link to="/"><TruekiLogo size="sm" /></Link>}
      {title && <h1 className="font-black text-base tracking-tight flex-1" style={{ letterSpacing: "-0.03em" }}>{title}</h1>}

      <div className="ml-auto flex items-center gap-1.5">
        {action}
        {showLogo && (
          <>
            <Link to="/search" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
              <Search className="h-4 w-4" />
            </Link>
            {user ? (
              <>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
                </button>
                <Link to="/settings" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
                  {initial}
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="hidden sm:block px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                  Entrar
                </Link>
                <Link to="/auth/signup" className="rounded-full bg-primary px-3 py-1.5 text-xs font-black hover:brightness-95 transition-all">
                  Registrarse
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
