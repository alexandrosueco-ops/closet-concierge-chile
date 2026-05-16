import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Crear cuenta — VeriCloset" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name, phone },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="app-shell flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-trust/10 text-trust">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold">Revisa tu email</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Enviamos un link de confirmación a <strong>{email}</strong>. Haz clic para activar tu cuenta.
        </p>
        <Link to="/auth/login" className="mt-6 rounded-full border border-border px-6 py-3 text-sm font-medium">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-dvh flex-col px-6 pt-14 safe-top">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <span className="font-display text-xl font-semibold">VeriCloset</span>
      </div>

      <h1 className="mt-10 font-display text-2xl font-semibold">Crear cuenta</h1>
      <p className="mt-1 text-sm text-muted-foreground">Únete al marketplace verificado de Chile.</p>

      <form onSubmit={handleSignup} className="mt-8 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="input w-full" placeholder="Nombre completo" required />

        <input value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" placeholder="Email" type="email" required autoComplete="email" />

        <div className="relative flex items-center">
          <span className="absolute left-4 text-sm text-muted-foreground select-none">+56</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input w-full pl-12"
            placeholder="9 XXXX XXXX"
            type="tel"
            inputMode="numeric"
          />
        </div>

        <div className="relative">
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full pr-12" placeholder="Contraseña (mín. 8 caracteres)" type={showPw ? "text" : "password"} required autoComplete="new-password" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {error && <p className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">{error}</p>}

        <p className="text-[11px] text-muted-foreground">
          Al registrarte aceptas nuestros{" "}
          <Link to="/legal/terms" className="underline">Términos</Link> y{" "}
          <Link to="/legal/privacy" className="underline">Política de privacidad</Link>.
        </p>

        <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
        </button>
      </form>

      <p className="mt-auto pb-8 pt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link to="/auth/login" className="font-semibold text-trust">Inicia sesión</Link>
      </p>
    </div>
  );
}
