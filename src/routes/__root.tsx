import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-black text-8xl opacity-10">404</p>
      <h1 className="mt-2 font-black text-2xl" style={{ letterSpacing: "-0.04em" }}>Página no encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">La página que buscas no existe.</p>
      <Link to="/" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-black">
        Volver al inicio
      </Link>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <div className="desktop-layout">
      <DesktopSidebar />
      <main className="desktop-content">
        <Outlet />
      </main>
    </div>
  ),
  notFoundComponent: NotFoundComponent,
});
