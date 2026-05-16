import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — VeriCloset" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ya autenticado → redirigir
  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (err) {
      setError("Email o contraseña incorrectos. Intenta de nuevo.");
      return;
    }
    navigate({ to: "/" });
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  return (
    <div className="app-shell flex min-h-dvh flex-col px-5 safe-top">
      <div className="pt-4">
        <Link to="/" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center pb-10">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-pop">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold">Bienvenido</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Inicia sesión en VeriCloset</p>
          </div>
        </div>

        {/* Google */}
        <button type="button" onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold transition-colors hover:bg-muted active:scale-[0.98]">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted-foreground">o con email</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            className="input w-full" placeholder="Email" type="email" required autoComplete="email" />
          <div className="relative">
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              className="input w-full pr-12" placeholder="Contraseña" type={showPw ? "text" : "password"}
              required autoComplete="current-password" />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <Link to="/auth/login" className="block text-right text-xs text-trust">¿Olvidaste tu contraseña?</Link>

          <button type="submit" disabled={submitting}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 active:scale-[0.98] transition-transform">
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Sin cuenta?{" "}
          <Link to="/auth/signup" className="font-semibold text-trust">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}
