import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Search, PlusSquare, Package, User,
  ShieldCheck, BarChart3, Warehouse, ChevronRight
} from "lucide-react";
import { TruekiLogo } from "@/components/TruekiLogo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/",             label: "Inicio",      icon: Home },
  { to: "/search",       label: "Explorar",    icon: Search },
  { to: "/buyer/orders", label: "Mis compras", icon: Package },
  { to: "/sell",         label: "Publicar",    icon: PlusSquare, accent: true },
  { to: "/settings",     label: "Cuenta",      icon: User },
];

const roleNav: Record<string, { to: string; label: string; icon: React.ElementType }[]> = {
  seller:    [{ to: "/seller/dashboard", label: "Panel vendedor",    icon: ShieldCheck }],
  warehouse: [{ to: "/warehouse/inbound",label: "Centro verificación", icon: Warehouse }],
  admin:     [{ to: "/admin",            label: "Admin Console",     icon: BarChart3 }],
};

export function DesktopSidebar() {
  const path = useRouterState({ select: s => s.location.pathname });
  const { user, roles, displayName, initial } = useAuth();
  const extraNav = roles.flatMap(r => roleNav[r] ?? []);

  return (
    <aside className="desktop-sidebar">
      {/* Logo */}
      <div className="mb-6 px-2">
        <Link to="/"><TruekiLogo size="sm" /></Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {mainNav.map(({ to, label, icon: Icon, accent }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link key={to} to={to as "/"}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-primary text-primary-foreground font-black"
                  : accent
                  ? "bg-primary/10 text-foreground hover:bg-primary/20 font-black"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* Separador + nav por rol */}
        {extraNav.length > 0 && (
          <>
            <div className="my-2 border-t border-border" />
            <p className="mb-1 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mi panel</p>
            {extraNav.map(({ to, label, icon: Icon }) => {
              const active = path.startsWith(to);
              return (
                <Link key={to} to={to as "/"}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                    active ? "bg-primary text-primary-foreground font-black" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Usuario en la parte inferior */}
      <div className="mt-auto pt-4 border-t border-border">
        {user ? (
          <Link to="/settings" className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-muted transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate" style={{ letterSpacing: "-0.02em" }}>{displayName}</p>
              <p className="text-[10px] text-muted-foreground">Ver cuenta</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </Link>
        ) : (
          <div className="space-y-1.5">
            <Link to="/auth/signup" className="block w-full rounded-full bg-primary py-2 text-center text-xs font-black">
              Crear cuenta
            </Link>
            <Link to="/auth/login" className="block w-full rounded-full border border-border py-2 text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
          </div>
        )}
        <p className="mt-3 px-2 text-[9px] text-muted-foreground">© 2025 Trueki · Santiago, Chile</p>
      </div>
    </aside>
  );
}
