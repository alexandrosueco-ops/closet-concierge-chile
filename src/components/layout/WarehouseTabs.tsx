import { Link, useRouterState } from "@tanstack/react-router";
import { PackageSearch, ShieldCheck, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/warehouse/inbound", label: "Inbound", icon: PackageSearch },
  { to: "/warehouse/verify", label: "Verificar", icon: ShieldCheck, primary: true },
  { to: "/warehouse/outbound", label: "Outbound", icon: PackageCheck },
];

export function WarehouseTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-around px-1 pt-1.5 pb-1">
        {tabs.map(({ to, label, icon: Icon, primary }) => {
          const active = path.startsWith(to);
          return (
            <Link key={to} to={to as "/"} className={cn("flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors", active ? "text-trust" : "text-muted-foreground")}>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", primary && "bg-primary text-primary-foreground shadow-pop scale-110", active && !primary && "bg-trust/10")}>
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
