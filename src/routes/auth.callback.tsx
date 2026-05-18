/**
 * /auth/callback — Maneja redirect después de OAuth (Google)
 * TanStack Router necesita esta ruta para procesar el token
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TruekiLogo } from "@/components/TruekiLogo";

export const Route = createFileRoute("/auth/callback" as string as any)({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error: err }) => {
      if (err) {
        setError("Error al verificar sesión. Inténtalo de nuevo.");
        return;
      }
      if (session) {
        navigate({ to: "/" });
      } else {
        // Esperar un momento para que se procese el hash del URL
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s2 } }) => {
            if (s2) navigate({ to: "/" });
            else navigate({ to: "/auth/login" });
          });
        }, 1000);
      }
    });
  }, [navigate]);

  if (error) return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-white">
      <p className="text-sm text-destructive mb-4">{error}</p>
      <a href="/auth/login" className="rounded-full bg-primary px-6 py-3 text-sm font-black">Volver a login</a>
    </div>
  );

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-white">
      <TruekiLogo size="lg" variant="icon" />
      <p className="text-sm text-muted-foreground font-medium">Verificando sesión...</p>
      <div className="flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}
