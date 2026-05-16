import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, PlusSquare, Package, User, ShieldCheck, BarChart3, Warehouse } from "lucide-react";
import { TruekiLogo } from "@/components/TruekiLogo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/",             label: "Inicio",   icon: Home },
  { to: "/search",       label: "Buscar",   icon: Search },
  { to: "/buyer/orders", label: "Mis compras", icon: Package },
  { to: "/sell",         label: "Publicar", icon: PlusSquare, accent: true },
  { to: "/settings",     label: "Cuenta",   icon: User },
];

const roleNav: Record<string, { to: string; label: string; icon: React.ElementType }[]> = {
  seller:    [{ to: "/seller/dashboard", label: "Panel vendedor", icon: ShieldCheck }],
  warehouse: [{ to: "/warehouse/inbound", label: "Centro verificación", icon: Warehouse }],
  admin:     [{ to: "/admin", label: "Admin Console", icon: BarChart3 }],
};

export function DesktopSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { roles } = useAuth();

  const extraNav = roles.flatMap((r) => roleNav[r] ?? []);

  return (
    <aside className="desktop-sidebar">
      {/* Logo */}
      <div className="mb-6 px-2">
        <TruekiLogo size="md" />
      </div>

      {/* Nav principal */}
      <nav className="flex flex-col gap-0.5">
        {mainNav.map(({ to, label, icon: Icon, accent }) => {
          const active = to === "/" ? path === "/" : path.startsWith(to);
          return (
            <Link key={to} to={to as "/"}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-primary text-primary-foreground"
                  : accent
                  ? "bg-primary/20 text-foreground hover:bg-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Nav por rol */}
      {extraNav.length > 0 && (
        <>
          <div className="my-3 border-t border-border" />
          <p className="mb-1.5 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mi panel</p>
          <nav className="flex flex-col gap-0.5">
            {extraNav.map(({ to, label, icon: Icon }) => {
              const active = path.startsWith(to);
              return (
                <Link key={to} to={to as "/"}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border">
        <p className="px-3 text-[10px] text-muted-foreground">© 2025 Trueki · Santiago, Chile</p>
      </div>
    </aside>
  );
}
