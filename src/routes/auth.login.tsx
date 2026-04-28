import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — VeriCloset" }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="app-shell flex min-h-dvh flex-col px-6 pt-16">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <span className="font-display text-xl font-semibold">VeriCloset</span>
      </div>
      <h1 className="mt-10 font-display text-2xl font-semibold">Bienvenido de vuelta</h1>
      <p className="mt-1 text-sm text-muted-foreground">Reventa premium verificada.</p>

      <div className="mt-8 space-y-3">
        <input className="input" placeholder="Email" type="email" />
        <input className="input" placeholder="Contraseña" type="password" />
        <button className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Entrar</button>
        <button className="w-full rounded-full border border-border py-3.5 text-sm font-semibold">Continuar con Google</button>
      </div>

      <p className="mt-auto pb-8 pt-8 text-center text-sm text-muted-foreground">
        ¿Sin cuenta? <Link to="/auth/signup" className="font-semibold text-trust">Regístrate</Link>
      </p>
    </div>
  );
}
