import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight, Store, Warehouse, Shield, FileText,
  LogOut, Bell, CreditCard, MapPin, Star, Package, User2
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth, signOut } from "@/hooks/useAuth";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Cuenta — VeriCloset" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}

function SettingsContent() {
  const { user, roles, displayName, initial } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const roleLabel: Record<string, string> = {
    buyer: "Comprador", seller: "Vendedor", warehouse: "Bodega",
    admin: "Admin", support: "Soporte",
  };

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Mi cuenta" />

      <div className="px-4 pt-4 space-y-4">
        {/* Avatar + info */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-semibold shadow-pop">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {roles.map((r) => (
                <span key={r} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">{roleLabel[r] ?? r}</span>
              ))}
            </div>
          </div>
          <button className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium">Editar</button>
        </div>

        {/* Accesos rápidos por rol */}
        {roles.includes("seller") && (
          <QuickLink icon={<Store className="h-4 w-4" />} label="Panel vendedor" sub="Publicaciones, ventas, pagos" to="/seller/dashboard" accent />
        )}
        {roles.includes("warehouse") && (
          <QuickLink icon={<Warehouse className="h-4 w-4" />} label="Centro de verificación" sub="Inbound, verificación, outbound" to="/warehouse/inbound" accent />
        )}
        {roles.includes("admin") && (
          <QuickLink icon={<Shield className="h-4 w-4" />} label="Admin Console" sub="Dashboard, pagos, disputas" to="/admin" accent />
        )}

        {/* Mis compras - siempre visible */}
        <QuickLink icon={<Package className="h-4 w-4" />} label="Mis compras" sub="Órdenes, seguimiento, disputas" to="/buyer/orders" />

        {/* Configuración */}
        <MenuGroup>
          <MenuItem icon={<User2 className="h-4 w-4" />} label="Perfil personal" />
          <MenuItem icon={<MapPin className="h-4 w-4" />} label="Direcciones de entrega" />
          <MenuItem icon={<CreditCard className="h-4 w-4" />} label="Métodos de pago" />
          <MenuItem icon={<Bell className="h-4 w-4" />} label="Notificaciones WhatsApp" />
          <MenuItem icon={<Star className="h-4 w-4" />} label="Reseñas recibidas" last />
        </MenuGroup>

        {/* Legal */}
        <MenuGroup>
          {[
            { label: "Términos y condiciones", to: "/legal/terms" },
            { label: "Política de privacidad", to: "/legal/privacy" },
            { label: "Política de autenticidad", to: "/legal/authenticity" },
            { label: "Reembolsos y devoluciones", to: "/legal/refunds" },
          ].map((item, i, arr) => (
            <Link key={i} to={item.to as "/"} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </MenuGroup>

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]">
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>

        <p className="text-center text-[11px] text-muted-foreground pb-2">VeriCloset v1.0 · Santiago, Chile 🇨🇱</p>
      </div>
      <BottomTabs />
    </div>
  );
}

function QuickLink({ icon, label, sub, to, accent }: { icon: React.ReactNode; label: string; sub: string; to: string; accent?: boolean }) {
  return (
    <Link to={to as "/"} className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors hover:bg-muted/50 active:scale-[0.98] ${accent ? "border-trust/20 bg-trust/5" : "border-border bg-card"}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accent ? "bg-trust/15 text-trust" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </Link>
  );
}

function MenuGroup({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-border bg-card">{children}</div>;
}

function MenuItem({ icon, label, last }: { icon: React.ReactNode; label: string; last?: boolean }) {
  return (
    <button className={`flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors ${!last ? "border-b border-border" : ""}`}>
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
