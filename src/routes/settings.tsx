import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Store, Warehouse, Shield, FileText, LogOut, User, Bell, CreditCard } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { useAuth, signOut } from "@/hooks/useAuth";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Cuenta — VeriCloset" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Usuario";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth/login" });
  };

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Cuenta" />
      <div className="px-4 pt-4 space-y-4">
        {/* Perfil */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
            {initial}
          </div>
          <div className="flex-1">
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <div className="mt-1 flex gap-1">
              {roles.map((r) => (
                <span key={r} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">{r}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Acceso rápido por rol */}
        {roles.includes("seller") && (
          <MenuItem icon={<Store className="h-4 w-4" />} label="Panel vendedor" to="/seller/dashboard" />
        )}
        {roles.includes("warehouse") && (
          <MenuItem icon={<Warehouse className="h-4 w-4" />} label="Bodega" to="/warehouse/inbound" />
        )}
        {roles.includes("admin") && (
          <MenuItem icon={<Shield className="h-4 w-4" />} label="Admin console" to="/admin" />
        )}

        {/* Configuración */}
        <div className="rounded-2xl border border-border overflow-hidden">
          {[
            { icon: <User className="h-4 w-4" />, label: "Editar perfil" },
            { icon: <Bell className="h-4 w-4" />, label: "Notificaciones" },
            { icon: <CreditCard className="h-4 w-4" />, label: "Métodos de pago" },
          ].map((item, i, arr) => (
            <button key={i} className={`flex w-full items-center gap-3 p-4 text-left hover:bg-muted/50 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-muted-foreground">{item.icon}</span>
              <span className="flex-1 text-sm">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Legal */}
        <div className="rounded-2xl border border-border overflow-hidden">
          {[
            { label: "Términos y condiciones", to: "/legal/terms" },
            { label: "Política de privacidad", to: "/legal/privacy" },
            { label: "Política de autenticidad", to: "/legal/authenticity" },
            { label: "Reembolsos y devoluciones", to: "/legal/refunds" },
          ].map((item, i, arr) => (
            <Link key={i} to={item.to as "/"} className={`flex items-center gap-3 p-4 hover:bg-muted/50 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>

        <p className="text-center text-[11px] text-muted-foreground pb-2">VeriCloset v1.0 · Santiago, Chile</p>
      </div>
      <BottomTabs />
    </div>
  );
}

function MenuItem({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <Link to={to as "/"} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-muted/50">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
