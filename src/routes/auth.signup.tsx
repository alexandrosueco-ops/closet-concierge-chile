import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Crear cuenta — VeriCloset" }] }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="app-shell flex min-h-dvh flex-col px-6 pt-16">
      <h1 className="font-display text-2xl font-semibold">Crear cuenta</h1>
      <p className="mt-1 text-sm text-muted-foreground">Únete al marketplace verificado.</p>
      <div className="mt-8 space-y-3">
        <input className="input" placeholder="Nombre" />
        <input className="input" placeholder="Email" type="email" />
        <input className="input" placeholder="Contraseña" type="password" />
        <button className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Crear cuenta</button>
      </div>
      <p className="mt-auto pb-8 pt-8 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta? <Link to="/auth/login" className="font-semibold text-trust">Inicia sesión</Link>
      </p>
    </div>
  );
}
