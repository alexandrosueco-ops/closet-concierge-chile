/**
 * NotifyMe — "Avísame cuando llegue"
 * Aparece cuando no hay listings de una categoría/marca
 * o como CTA flotante en search
 */
import { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NotifyMeProps {
  brandId?: string;
  brandName?: string;
  categoryId?: string;
  categoryName?: string;
  compact?: boolean;
}

export function NotifyMe({ brandId, brandName, categoryId, categoryName, compact }: NotifyMeProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = brandName ?? categoryName ?? "este artículo";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    const { error: err } = await (supabase as any).from("notify_requests").insert({
      email,
      whatsapp: whatsapp ? `+56${whatsapp.replace(/\D/g, "")}` : null,
      brand_id: brandId ?? null,
      category_id: categoryId ?? null,
    });

    setLoading(false);
    if (err && !err.message.includes("unique")) {
      setError("Error al guardar. Inténtalo de nuevo.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-primary/10 border-2 border-primary/30 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shrink-0">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
        <p className="text-sm font-bold">¡Listo! Te avisamos cuando llegue {label}.</p>
      </div>
    );
  }

  if (compact && !open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-xs font-black hover:border-primary transition-all">
        <Bell className="h-3.5 w-3.5" />
        Avísame cuando llegue {label}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary-foreground" />
          <p className="text-sm font-black">Avísame cuando llegue {label}</p>
        </div>
        {compact && <button onClick={() => setOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>}
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          type="email"
          required
          className="input w-full"
        />
        <div className="relative flex items-center">
          <span className="absolute left-4 text-sm text-muted-foreground select-none">+56</span>
          <input
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ""))}
            className="input w-full pl-12"
            placeholder="9 XXXX XXXX (opcional)"
            type="tel"
            inputMode="numeric"
            maxLength={9}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button type="submit" disabled={loading || !email}
          className="w-full rounded-full bg-primary py-3 text-sm font-black disabled:opacity-50">
          {loading ? "Guardando..." : "Notifícame"}
        </button>
        <p className="text-[10px] text-muted-foreground text-center">
          Te avisamos por email o WhatsApp cuando tengamos stock.
        </p>
      </form>
    </div>
  );
}
