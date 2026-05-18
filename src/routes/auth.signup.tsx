import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TruekiLogo } from "@/components/TruekiLogo";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Crear cuenta — Trueki" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const pwColor = ["", "bg-destructive", "bg-yellow-400", "bg-green-400"][pwStrength];
  const pwLabel = ["", "Débil", "Aceptable", "Segura"][pwStrength];

  const handleGoogle = async () => {
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (err) setError("Error al conectar con Google.");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    setSubmitting(true);

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name, full_name: name },
        emailRedirectTo: `${window.location.origin}/?welcome=1`,
      },
    });

    setSubmitting(false);
    if (err) {
      if (err.message.includes("already registered")) {
        setError("Este email ya tiene una cuenta. ¿Quieres iniciar sesión?");
      } else {
        setError(err.message);
      }
      return;
    }
    setDone(true);
  };

  if (done) return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-5">
        <Check className="h-10 w-10" style={{ color: "#dadd48" }} />
      </div>
      <h1 className="font-black text-2xl mb-2" style={{ letterSpacing: "-0.04em" }}>¡Revisa tu email!</h1>
      <p className="text-sm text-muted-foreground max-w-xs mb-2">
        Enviamos un link de confirmación a <strong>{email}</strong>.
      </p>
      <p className="text-sm text-muted-foreground max-w-xs mb-8">
        Una vez confirmado, recibirás también un email de bienvenida con todo lo que necesitas saber.
      </p>
      <Link to="/auth/login" className="rounded-full border-2 border-border px-6 py-3 text-sm font-black">
        Ir a iniciar sesión
      </Link>
    </div>
  );

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <TruekiLogo size="sm" />
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-10 max-w-md mx-auto w-full">
        <div className="mb-8">
          <h1 className="font-black text-3xl mb-1" style={{ letterSpacing: "-0.04em" }}>Crear cuenta</h1>
          <p className="text-sm text-muted-foreground">Únete al marketplace premium de Chile.</p>
        </div>

        <button type="button" onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-border bg-card py-3.5 text-sm font-bold transition-all hover:bg-muted active:scale-[0.98] mb-5">
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Registrarse con Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted-foreground font-medium">o con email</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)}
            className="input w-full" placeholder="Nombre completo" required autoComplete="name" />

          <input value={email} onChange={e => setEmail(e.target.value)}
            className="input w-full" placeholder="Email" type="email" required autoComplete="email" />

          <div>
            <div className="relative">
              <input value={password} onChange={e => setPassword(e.target.value)}
                className="input w-full pr-12" placeholder="Contraseña (mín. 8 caracteres)"
                type={showPw ? "text" : "password"} required autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength ? pwColor : "bg-muted"}`} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">{pwLabel}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
              {error.includes("ya tiene una cuenta") && (
                <Link to="/auth/login" className="block mt-1 font-bold underline">Iniciar sesión →</Link>
              )}
            </div>
          )}

          <p className="text-[11px] text-muted-foreground">
            Al registrarte aceptas nuestros{" "}
            <Link to="/legal/terms" className="underline">Términos</Link> y{" "}
            <Link to="/legal/privacy" className="underline">Política de privacidad</Link>.
          </p>

          <button type="submit" disabled={submitting}
            className="w-full rounded-full bg-foreground py-3.5 text-sm font-black text-background disabled:opacity-60 active:scale-[0.98] transition-all">
            {submitting ? "Creando cuenta..." : "Crear cuenta gratis"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" className="font-black text-foreground hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
