import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TruekiLogo, TruekiIcon } from "@/components/TruekiLogo";

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  backTo?: string;
  action?: React.ReactNode;
}

export function AppHeader({ title, showLogo, backTo, action }: AppHeaderProps) {
  const { user, initial } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-3 safe-top">
      {backTo && (
        <Link to={backTo as "/"} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}

      {showLogo && <TruekiLogo size="sm" />}
      {title && <h1 className="font-black text-base tracking-tight flex-1" style={{ letterSpacing: "-0.03em" }}>{title}</h1>}

      <div className="ml-auto flex items-center gap-2">
        {action}
        {showLogo && user && (
          <>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
            </button>
            <Link to="/settings" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
              {initial}
            </Link>
          </>
        )}
        {showLogo && !user && (
          <Link to="/auth/login" className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold hover:brightness-95 transition-all">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
