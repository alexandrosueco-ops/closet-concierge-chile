import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, DollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/seller/dashboard", label: "Panel", icon: LayoutDashboard },
  { to: "/seller/orders", label: "Ventas", icon: Package },
  { to: "/sell", label: "Publicar", icon: DollarSign, primary: true },
  { to: "/settings", label: "Cuenta", icon: Settings },
];

export function SellerTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-around px-2 pt-1.5">
        {tabs.map(({ to, label, icon: Icon, primary }) => {
          const active = path.startsWith(to);
          return (
            <Link key={to} to={to} className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium",
              active ? "text-trust" : "text-muted-foreground"
            )}>
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                primary && "bg-primary text-primary-foreground shadow-pop",
                active && !primary && "bg-trust/10"
              )}>
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
