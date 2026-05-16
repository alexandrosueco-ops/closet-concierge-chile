import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { ShieldCheck } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRoles = [], redirectTo = "/auth/login" }: AuthGuardProps) {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: redirectTo as "/" }); return; }
    if (requiredRoles.length > 0 && !requiredRoles.some((r) => roles.includes(r))) {
      navigate({ to: "/" });
    }
  }, [user, roles, loading, navigate, redirectTo, requiredRoles]);

  if (loading) return <LoadingScreen />;
  if (!user) return null;
  if (requiredRoles.length > 0 && !requiredRoles.some((r) => roles.includes(r))) return null;

  return <>{children}</>;
}

export function LoadingScreen() {
  return (
    <div className="app-shell flex min-h-dvh flex-col items-center justify-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 animate-pulse">
        <ShieldCheck className="h-7 w-7 text-primary" />
      </div>
      <div className="space-y-2 text-center">
        <div className="h-2 w-32 rounded-full bg-muted animate-pulse mx-auto" />
        <div className="h-2 w-20 rounded-full bg-muted animate-pulse mx-auto" />
      </div>
    </div>
  );
}
