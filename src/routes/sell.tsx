import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowLeft, Camera, ShieldCheck, X, Check, AlertCircle, Package, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBrands, useCategories, formatCLP } from "@/hooks/useListings";
import { AppHeader } from "@/components/layout/AppHeader";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Publicar artículo — Trueki" }] }),
  component: SellPage,
});

const CONDITIONS = [
  { value: "new_with_tags",  label: "Nuevo con etiqueta",  desc: "Nunca usado, con etiqueta original" },
  { value: "like_new",       label: "Como nuevo",          desc: "Sin signos de uso" },
  { value: "very_good",      label: "Muy buen estado",     desc: "Uso mínimo, sin defectos visibles" },
  { value: "good",           label: "Buen estado",         desc: "Uso normal, pequeños detalles" },
];
const SIZES = ["XS","S","M","L","XL","XXL","36","37","38","39","40","41","42","43","44","45","Único"];

interface FormData {
  brandId: string; categoryId: string; title: string;
  description: string; size: string; condition: string;
  priceSuggestionCLP: number;
  photos: File[]; photoUrls: string[];
  sellerName: string; sellerPhone: string; sellerEmail: string;
}

function SellPage() {
  const navigate = useNavigate();
  const brands = useBrands();
  const categories = useCategories();
  const [step, setStep] = useState<1|2|3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    brandId: "", categoryId: "", title: "", description: "",
    size: "", condition: "", priceSuggestionCLP: 0,
    photos: [], photoUrls: [],
    sellerName: "", sellerPhone: "", sellerEmail: "",
  });

  const upd = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const urls = files.map(f => URL.createObjectURL(f));
    upd({ photos: [...form.photos, ...files], photoUrls: [...form.photoUrls, ...urls] });
  };

  const removePhoto = (i: number) => {
    upd({
      photos: form.photos.filter((_, j) => j !== i),
      photoUrls: form.photoUrls.filter((_, j) => j !== i),
    });
  };

  const canStep1 = form.brandId && form.categoryId && form.condition && form.size && form.photos.length >= 2;
  const canStep2 = form.title && form.description;
  const canStep3 = form.sellerName && form.sellerEmail;

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // Crear listing en draft — Trueki lo revisa y publica
      const { data: listing, error: err } = await supabase.from("listings").insert({
        seller_id: user?.id ?? "00000000-0000-0000-0000-000000000001",
        brand_id: form.brandId,
        category_id: form.categoryId,
        title: form.title,
        description: form.description,
        size: form.size,
        condition: form.condition as "new_with_tags" | "like_new" | "very_good" | "good" | "fair",
        price_clp: form.priceSuggestionCLP || 0,
        status: "draft",
      }).select().single();

      if (err || !listing) throw new Error(err?.message ?? "Error al enviar");

      // Subir fotos de referencia
      for (let i = 0; i < Math.min(form.photos.length, 6); i++) {
        const file = form.photos[i];
        const ext = file.name.split(".").pop();
        const path = `${user?.id ?? "anon"}/${listing.id}/ref-${i}.${ext}`;
        await supabase.storage.from("listing-photos").upload(path, file, { contentType: file.type, upsert: true });
      }

      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (done) return <SuccessScreen onNew={() => { setDone(false); setStep(1); setForm({ brandId:"", categoryId:"", title:"", description:"", size:"", condition:"", priceSuggestionCLP:0, photos:[], photoUrls:[], sellerName:"", sellerPhone:"", sellerEmail:"" }); }} />;

  return (
    <div className="app-shell pb-36">
      <AppHeader backTo="/" title="Enviar artículo a Trueki" />

      {/* Barra progreso */}
      <div className="h-1 bg-muted">
        <div className="h-1 bg-primary transition-all duration-500" style={{ width: `${(step/3)*100}%` }} />
      </div>

      {/* Cómo funciona — banner informativo */}
      <div className="mx-4 mt-4 rounded-2xl border-2 border-border bg-muted/40 p-4">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">¿Cómo funciona?</p>
        <div className="space-y-2">
          {[
            { icon: <Package className="h-4 w-4 shrink-0 text-primary-foreground" />, t: "Tú envías el artículo a nuestro centro en Santiago (a tu costo)." },
            { icon: <ShieldCheck className="h-4 w-4 shrink-0 text-primary-foreground" />, t: "Nosotros verificamos, fotografiamos y publicamos por ti. Gratis." },
            { icon: <Truck className="h-4 w-4 shrink-0 text-primary-foreground" />, t: "Cuando se vende, el comprador paga el envío y tú cobras." },
          ].map(({ icon, t }, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary">{icon}</div>
              <p className="text-xs text-muted-foreground leading-snug">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PASO 1 — Artículo + fotos */}
      {step === 1 && (
        <div className="px-4 pt-5 space-y-5">
          <div>
            <h2 className="font-black text-xl mb-0.5" style={{ letterSpacing: "-0.03em" }}>Paso 1 de 3</h2>
            <p className="text-sm text-muted-foreground">Cuéntanos sobre el artículo y sube algunas fotos de referencia.</p>
          </div>

          {/* Marca */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-2">Marca *</label>
            <div className="flex flex-wrap gap-2">
              {brands.map(b => (
                <button key={b.id} onClick={() => upd({ brandId: b.id })}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${form.brandId === b.id ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-2">Categoría *</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c.id} onClick={() => upd({ categoryId: c.id })}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${form.categoryId === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condición */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-2">Condición *</label>
            <div className="space-y-2">
              {CONDITIONS.map(c => (
                <label key={c.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-all ${form.condition === c.value ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name="condition" value={c.value} checked={form.condition === c.value} onChange={() => upd({ condition: c.value })} className="mt-0.5 accent-[#dadd48]" />
                  <div><p className="text-sm font-bold">{c.label}</p><p className="text-xs text-muted-foreground">{c.desc}</p></div>
                </label>
              ))}
            </div>
          </div>

          {/* Talla */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-2">Talla *</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} onClick={() => upd({ size: s })}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold ${form.size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Precio sugerido */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-2">Precio sugerido (CLP)</label>
            <p className="text-xs text-muted-foreground mb-2">Referencial — Trueki puede ajustarlo según el mercado.</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input type="number" value={form.priceSuggestionCLP || ""} onChange={e => upd({ priceSuggestionCLP: parseInt(e.target.value) || 0 })}
                className="input w-full pl-8" placeholder="50000" inputMode="numeric" />
            </div>
          </div>

          {/* Fotos de referencia */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Fotos de referencia (mín. 2) *</label>
            <p className="text-xs text-muted-foreground mb-3">No necesitan ser perfectas — Trueki tomará fotos profesionales al recibirlo.</p>
            <div className="grid grid-cols-3 gap-2">
              {form.photoUrls.map((url, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => removePhoto(i)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/90">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {form.photos.length < 8 && (
                <button onClick={() => fileRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted">
                  <Camera className="h-5 w-5" /><span className="text-[10px]">Agregar</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addPhoto} />
          </div>
        </div>
      )}

      {/* PASO 2 — Descripción */}
      {step === 2 && (
        <div className="px-4 pt-5 space-y-5">
          <div>
            <h2 className="font-black text-xl mb-0.5" style={{ letterSpacing: "-0.03em" }}>Paso 2 de 3</h2>
            <p className="text-sm text-muted-foreground">Describe el artículo para que Trueki pueda publicarlo correctamente.</p>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Título *</label>
            <input value={form.title} onChange={e => upd({ title: e.target.value })} className="input w-full"
              placeholder="Ej: Louis Vuitton Speedy 30 monogram canvas" />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Descripción *</label>
            <textarea value={form.description} onChange={e => upd({ description: e.target.value })}
              className="input w-full min-h-[120px]" placeholder="Describe el estado, antigüedad, historial de compra, accesorios incluidos..." />
          </div>

          <div className="rounded-2xl border-2 border-border bg-muted/40 p-4">
            <p className="text-xs font-black mb-2">💡 Tips para una buena descripción</p>
            {["Cómo y cuándo lo compraste", "Veces de uso aproximadas", "Accesorios incluidos (dustbag, caja, etc.)", "Algún detalle o defecto menor"].map((t,i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Check className="h-3 w-3 text-primary shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASO 3 — Datos de contacto */}
      {step === 3 && (
        <div className="px-4 pt-5 space-y-5">
          <div>
            <h2 className="font-black text-xl mb-0.5" style={{ letterSpacing: "-0.03em" }}>Paso 3 de 3</h2>
            <p className="text-sm text-muted-foreground">Tus datos para coordinar el envío del artículo a Trueki.</p>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Nombre completo *</label>
            <input value={form.sellerName} onChange={e => upd({ sellerName: e.target.value })} className="input w-full" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Email *</label>
            <input value={form.sellerEmail} onChange={e => upd({ sellerEmail: e.target.value })} className="input w-full" type="email" placeholder="tu@email.com" />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">WhatsApp</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-sm text-muted-foreground select-none">+56</span>
              <input value={form.sellerPhone} onChange={e => upd({ sellerPhone: e.target.value.replace(/\D/g, "") })}
                className="input w-full pl-12" placeholder="9 XXXX XXXX" type="tel" inputMode="numeric" maxLength={9} />
            </div>
          </div>

          {/* Resumen antes de enviar */}
          <div className="rounded-2xl border-2 border-border overflow-hidden">
            <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Resumen de tu solicitud</p>
            </div>
            <div className="p-4 space-y-2 text-sm">
              {form.photoUrls[0] && <img src={form.photoUrls[0]} className="h-20 w-20 rounded-xl object-cover mb-3" alt="" />}
              <div className="flex justify-between"><span className="text-muted-foreground">Artículo</span><span className="font-bold">{form.title || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Condición</span><span className="font-bold capitalize">{form.condition.replace("_"," ") || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Talla</span><span className="font-bold">{form.size || "—"}</span></div>
              {form.priceSuggestionCLP > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Precio sugerido</span><span className="font-bold">{formatCLP(form.priceSuggestionCLP)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Fotos de referencia</span><span className="font-bold">{form.photos.length}</span></div>
            </div>
          </div>

          {/* Términos */}
          <div className="rounded-2xl border-2 border-border bg-muted/40 p-4 space-y-2">
            <p className="text-xs font-black">Al enviar confirmas que:</p>
            {[
              "El artículo es 100% auténtico y de la marca indicada.",
              "Lo enviarás a nuestro centro en Santiago a tu costo.",
              "Trueki puede ajustar el precio de venta según el mercado.",
              "La comisión de Trueki se descuenta automáticamente al vender.",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /><span>{t}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}
        </div>
      )}

      {/* CTA fijo */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background safe-bottom">
        <div className="mx-auto max-w-[480px] p-3">
          {step < 3 ? (
            <button onClick={() => setStep(s => (s+1) as 2|3)}
              disabled={step === 1 ? !canStep1 : !canStep2}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-black disabled:opacity-40">
              {step === 1 ? `Continuar (${form.photos.length}/2 fotos mín.)` : "Revisar solicitud"}
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canStep3 || loading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-black disabled:opacity-60">
              {loading ? "Enviando solicitud..." : "Enviar solicitud a Trueki"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ onNew }: { onNew: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="app-shell flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-4">
        <Check className="h-10 w-10 text-primary-foreground" />
      </div>
      <h1 className="font-black text-2xl mb-2" style={{ letterSpacing: "-0.04em" }}>¡Solicitud enviada!</h1>
      <p className="text-sm text-muted-foreground max-w-xs mb-2">
        Revisaremos tu artículo y te contactaremos por WhatsApp o email con las instrucciones de envío.
      </p>
      <p className="text-sm text-muted-foreground max-w-xs mb-8">
        Una vez que lo recibamos, lo verificamos, fotografiamos y publicamos por ti. <strong>Gratis.</strong>
      </p>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <button onClick={() => navigate({ to: "/seller/dashboard" })} className="rounded-full bg-primary px-6 py-3 text-sm font-black">Ver mi panel</button>
        <button onClick={onNew} className="rounded-full border-2 border-border px-6 py-3 text-sm font-bold">Enviar otro artículo</button>
      </div>
    </div>
  );
}
