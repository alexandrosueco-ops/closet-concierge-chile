import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Package, Camera, ShieldCheck, Zap, Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useBrands } from "@/hooks/useListings";
import { TruekiLogo } from "@/components/TruekiLogo";

export const Route = createFileRoute("/sell/waitlist" as string as any)({
  head: () => ({ meta: [{ title: "Únete como vendedor — Trueki" }] }),
  component: SellerWaitlist,
});

const BENEFICIOS = [
  { icon: <Package className="h-5 w-5" />, t: "Publicación gratuita", d: "Enviamos el artículo, lo fotografiamos y publicamos. Sin costo." },
  { icon: <Camera className="h-5 w-5" />, t: "Fotos profesionales", d: "Nuestro equipo toma fotos de estudio que venden más rápido." },
  { icon: <ShieldCheck className="h-5 w-5" />, t: "Nosotros gestionamos todo", d: "Desde la verificación hasta el despacho al comprador. Tú solo cobras." },
  { icon: <Zap className="h-5 w-5" />, t: "Pago rápido", d: "2 horas tras la entrega, el dinero es tuyo. Automático." },
];

const MARCAS_POPULARES = ["Louis Vuitton", "Gucci", "Jordan", "Nike", "Chanel", "Balenciaga", "Prada", "New Balance", "Hermès", "Adidas", "Coach", "Burberry"];

function SellerWaitlist() {
  const [form, setForm] = useState({
    nombre: "", email: "", whatsapp: "", instagram: "",
    descripcion: "", marcas: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMarca = (m: string) =>
    setForm(f => ({
      ...f,
      marcas: f.marcas.includes(m) ? f.marcas.filter(x => x !== m) : [...f.marcas, m],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: err } = await (supabase as any).from("seller_waitlist").insert({
      nombre: form.nombre,
      email: form.email,
      whatsapp: form.whatsapp ? `+56${form.whatsapp.replace(/\D/g, "")}` : null,
      instagram: form.instagram ? form.instagram.replace("@", "") : null,
      descripcion: form.descripcion || null,
      marcas: form.marcas.length > 0 ? form.marcas : null,
    });

    setLoading(false);
    if (err) { setError("Error al enviar. Inténtalo de nuevo."); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-5">
          <Check className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="font-black text-2xl mb-2" style={{ letterSpacing: "-0.04em" }}>¡Estás en la lista!</h1>
        <p className="text-sm text-muted-foreground max-w-xs mb-2">
          Te contactaremos pronto por WhatsApp o email con los siguientes pasos para enviar tu primer artículo.
        </p>
        <p className="text-sm text-muted-foreground max-w-xs mb-8">
          Los primeros vendedores tienen <strong>0% de comisión</strong> durante 3 meses.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Link to="/" className="rounded-full bg-primary px-6 py-3 text-sm font-black text-center">
            Explorar Trueki
          </Link>
          <Link to="/sell" className="rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-center">
            Enviar artículo ahora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white/95 backdrop-blur px-4">
        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <TruekiLogo size="sm" variant="icon" />
        <div className="w-9" />
      </div>

      <div className="max-w-lg mx-auto px-5 pt-8">
        {/* Hero texto */}
        <div className="mb-8">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded mb-3 bg-primary text-primary-foreground">
            Para vendedores
          </span>
          <h1 className="font-black text-3xl mb-2" style={{ letterSpacing: "-0.04em" }}>
            Vende tu ropa premium.<br />Nosotros hacemos el resto.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Únete a la lista de vendedores Trueki. Los primeros en entrar tienen <strong>0% de comisión durante 3 meses</strong>.
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {BENEFICIOS.map(({ icon, t, d }, i) => (
            <div key={i} className="rounded-2xl border-2 border-border p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-2">{icon}</div>
              <p className="text-sm font-black mb-0.5" style={{ letterSpacing: "-0.02em" }}>{t}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Nombre *</label>
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="input w-full" placeholder="Tu nombre completo" required />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Email *</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input w-full" type="email" placeholder="tu@email.com" required />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">WhatsApp</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm text-muted-foreground select-none">+56</span>
              <input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value.replace(/\D/g, "") }))}
                className="input w-full pl-12" placeholder="9 XXXX XXXX" type="tel" inputMode="numeric" maxLength={9} />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">
              <Instagram className="inline h-3 w-3 mr-1" />Instagram (opcional)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm text-muted-foreground select-none">@</span>
              <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value.replace("@", "") }))}
                className="input w-full pl-8" placeholder="tu_usuario" />
            </div>
          </div>

          {/* Marcas */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-2">
              ¿Qué marcas tienes? (opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              {MARCAS_POPULARES.map(m => (
                <button key={m} type="button" onClick={() => toggleMarca(m)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${form.marcas.includes(m) ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">
              Cuéntanos más (opcional)
            </label>
            <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              className="input w-full min-h-[80px]"
              placeholder="Qué artículos tienes, cuántos aproximadamente, o cualquier cosa que quieras contarnos..." />
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading || !form.nombre || !form.email}
            className="w-full rounded-full bg-primary py-4 text-sm font-black disabled:opacity-50">
            {loading ? "Enviando..." : "Unirme a la lista de vendedores"}
          </button>

          <p className="text-[11px] text-muted-foreground text-center">
            Sin compromiso. Te contactamos en 24–48h para coordinar.
          </p>
        </form>
      </div>
    </div>
  );
}
