import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Crear cuenta — Trueki" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const pwLabel = ["", "Débil", "Aceptable", "Segura"][pwStrength];
  const pwColor = ["", "bg-destructive", "bg-warning", "bg-success"][pwStrength];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    setSubmitting(true);
    const { error: err } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { display_name: name, phone },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setSubmitting(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className="app-shell flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold">¡Revisa tu email!</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Enviamos un link de confirmación a <strong>{email}</strong>. Haz clic para activar tu cuenta.
        </p>
        <Link to="/auth/login" className="mt-6 rounded-2xl border border-border px-6 py-3 text-sm font-semibold">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-dvh flex-col px-5 safe-top">
      <div className="pt-4">
        <Link to="/auth/login" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center pb-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-pop">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Crear cuenta</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Únete al marketplace verificado de Chile</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="input w-full" placeholder="Nombre completo" required autoComplete="name" />

          <input value={email} onChange={(e) => setEmail(e.target.value)}
            className="input w-full" placeholder="Email" type="email" required autoComplete="email" />

          <div className="relative flex items-center">
            <span className="absolute left-4 text-sm text-muted-foreground select-none">+56</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="input w-full pl-12" placeholder="9 XXXX XXXX" type="tel" inputMode="numeric" maxLength={9} />
          </div>

          <div>
            <div className="relative">
              <input value={password} onChange={(e) => setPassword(e.target.value)}
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
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength ? pwColor : "bg-muted"}`} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">{pwLabel}</span>
              </div>
            )}
          </div>

          {error && <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

          <p className="text-[11px] text-muted-foreground">
            Al registrarte aceptas nuestros{" "}
            <Link to="/legal/terms" className="underline text-trust">Términos</Link> y{" "}
            <Link to="/legal/privacy" className="underline text-trust">Política de privacidad</Link>.
          </p>

          <button type="submit" disabled={submitting}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 active:scale-[0.98] transition-transform">
            {submitting ? "Creando cuenta..." : "Crear cuenta gratis"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" className="font-semibold text-trust">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
