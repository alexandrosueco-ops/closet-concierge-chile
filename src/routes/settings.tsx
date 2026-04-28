import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Store, Warehouse, Shield, FileText, LogOut } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Cuenta — VeriCloset" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="app-shell pb-24">
      <AppHeader title="Cuenta" />
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">M</div>
          <div className="flex-1">
            <p className="font-medium">María Demo</p>
            <p className="text-xs text-muted-foreground">maria@ejemplo.cl</p>
          </div>
        </div>

        <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cambiar de modo</p>
        <Group>
          <Row to="/seller/dashboard" icon={<Store className="h-4 w-4" />} label="Modo vendedor" />
          <Row to="/warehouse/inbound" icon={<Warehouse className="h-4 w-4" />} label="Modo bodega (staff)" />
          <Row to="/admin" icon={<Shield className="h-4 w-4" />} label="Admin" />
        </Group>

        <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</p>
        <Group>
          <Row to="/legal/terms" icon={<FileText className="h-4 w-4" />} label="Términos" />
          <Row to="/legal/privacy" icon={<FileText className="h-4 w-4" />} label="Privacidad" />
          <Row to="/legal/refunds" icon={<FileText className="h-4 w-4" />} label="Reembolsos" />
          <Row to="/legal/authenticity" icon={<FileText className="h-4 w-4" />} label="Autenticidad" />
        </Group>

        <Link to="/auth/login" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </Link>
      </div>
      <BottomTabs />
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-border bg-card">{children}</div>;
}

function Row({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to as "/"} className="flex items-center gap-3 border-b border-border p-3.5 last:border-b-0 hover:bg-muted">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground">{icon}</div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
