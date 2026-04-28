import { Link, useRouterState } from "@tanstack/react-router";
import { Inbox, ShieldCheck, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/warehouse/inbound", label: "Entradas", icon: Inbox },
  { to: "/warehouse/verify", label: "Verificar", icon: ShieldCheck },
  { to: "/warehouse/outbound", label: "Salidas", icon: Send },
];

export function WarehouseTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-[480px] items-stretch justify-around px-2 pt-1.5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = path.startsWith(to);
          return (
            <Link key={to} to={to as "/"} className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium",
              active ? "text-trust" : "text-muted-foreground"
            )}>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", active && "bg-trust/10")}>
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
