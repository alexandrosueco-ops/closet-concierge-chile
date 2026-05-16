import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowLeft, Camera, ShieldCheck, X, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatCLP } from "@/lib/mock-data";
import { useBrands, useCategories } from "@/hooks/useListings";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Publicar — Trueki" }] }),
  component: SellWizard,
});

interface FormData {
  brandId: string;
  brandName: string;
  categoryId: string;
  title: string;
  description: string;
  size: string;
  condition: string;
  priceCLP: number;
  photos: File[];
  photoUrls: string[];
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "Único"];
const CONDITIONS = [
  { value: "new_with_tags", label: "Nuevo con etiqueta", desc: "Nunca usado, con etiqueta original" },
  { value: "like_new", label: "Como nuevo", desc: "Sin signos de uso" },
  { value: "very_good", label: "Muy buen estado", desc: "Uso mínimo, sin defectos" },
  { value: "good", label: "Buen estado", desc: "Uso normal, pequeños detalles" },
];

function SellWizard() {
  const navigate = useNavigate();
  const brands = useBrands();
  const categories = useCategories();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    brandId: "", brandName: "", categoryId: "", title: "",
    description: "", size: "", condition: "", priceCLP: 0,
    photos: [], photoUrls: [],
  });

  const update = (patch: Partial<FormData>) => setForm((f) => ({ ...f, ...patch }));

  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    update({ photos: [...form.photos, ...files], photoUrls: [...form.photoUrls, ...urls] });
  };

  const removePhoto = (i: number) => {
    update({
      photos: form.photos.filter((_, j) => j !== i),
      photoUrls: form.photoUrls.filter((_, j) => j !== i),
    });
  };

  const selectedBrand = brands.find((b) => b.id === form.brandId);
  const minPhotos = selectedBrand?.risk_level === "high" ? 6 : selectedBrand?.risk_level === "medium" ? 4 : 2;

  const canNext1 = form.photos.length >= minPhotos;
  const canNext2 = form.brandId && form.categoryId && form.title && form.condition && form.size && form.priceCLP > 0;

  const handlePublish = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/auth/login" }); return; }

      // Crear listing en draft
      const { data: listing, error: listErr } = await supabase.from("listings").insert({
        seller_id: user.id,
        brand_id: form.brandId,
        category_id: form.categoryId,
        title: form.title,
        description: form.description,
        size: form.size,
        condition: form.condition as "new_with_tags" | "like_new" | "very_good" | "good" | "fair",
        price_clp: form.priceCLP,
        status: "draft",
      }).select().single();

      if (listErr || !listing) throw new Error(listErr?.message ?? "Error al crear publicación");

      // Subir fotos
      const photoRecords: { listing_id: string; url: string; position: number }[] = [];
      for (let i = 0; i < form.photos.length; i++) {
        const file = form.photos[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${listing.id}/${i}.${ext}`;
        const { data: uploaded, error: upErr } = await supabase.storage
          .from("listing-photos")
          .upload(path, file, { contentType: file.type, upsert: true });

        if (!upErr && uploaded) {
          const { data: { publicUrl } } = supabase.storage.from("listing-photos").getPublicUrl(path);
          photoRecords.push({ listing_id: listing.id, url: publicUrl, position: i });
        }
      }

      if (photoRecords.length > 0) {
        await supabase.from("listing_photos").insert(photoRecords);
      }

      // Publicar
      await supabase.from("listings").update({ status: "published" }).eq("id", listing.id);

      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (done) return <SuccessScreen onNew={() => { setDone(false); setStep(1); setForm({ brandId:"",brandName:"",categoryId:"",title:"",description:"",size:"",condition:"",priceCLP:0,photos:[],photoUrls:[] }); }} />;

  return (
    <div className="app-shell pb-32">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <button onClick={() => step === 1 ? history.back() : setStep((s) => (s - 1) as 1 | 2 | 3)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-base font-semibold">Publicar artículo</h1>
          <p className="text-[11px] text-muted-foreground">Paso {step} de 3</p>
        </div>
      </header>

      {/* Barra de progreso */}
      <div className="h-1 bg-muted">
        <div className="h-1 bg-trust transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      {/* PASO 1 — Fotos */}
      {step === 1 && (
        <div className="px-4 pt-5 space-y-5">
          <div>
            <h2 className="font-display text-xl font-semibold">Fotos del artículo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mín. {minPhotos} fotos: frontal, trasera, etiqueta y detalles.
              {selectedBrand?.risk_level === "high" && <span className="ml-1 text-destructive font-medium">Marca de alto riesgo — se requieren {minPhotos} fotos.</span>}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {form.photoUrls.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button onClick={() => removePhoto(i)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90">
                  <X className="h-3 w-3" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold">Principal</span>}
              </div>
            ))}
            {form.photos.length < 10 && (
              <button onClick={() => fileRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted">
                <Camera className="h-6 w-6" />
                <span className="text-[11px]">Agregar</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addPhoto} />

          {/* Tips fotos */}
          <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-2">
            <p className="text-xs font-semibold">Consejos para mejores fotos</p>
            {["Fondo blanco o neutro", "Buena iluminación natural", "Muestra etiqueta y defectos si los hay", "Fotos nítidas sin filtros"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-trust shrink-0" />{t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASO 2 — Detalles */}
      {step === 2 && (
        <div className="px-4 pt-5 space-y-4">
          <h2 className="font-display text-xl font-semibold">Detalles del artículo</h2>

          {/* Marca */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marca</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {brands.filter((b) => b).map((b) => (
                <button key={b.id} onClick={() => update({ brandId: b.id, brandName: b.name })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${form.brandId === b.id ? "border-trust bg-trust/10 text-trust" : "border-border"}`}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c.id} onClick={() => update({ categoryId: c.id })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${form.categoryId === c.id ? "border-trust bg-trust/10 text-trust" : "border-border"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</label>
            <input value={form.title} onChange={(e) => update({ title: e.target.value })}
              className="input mt-1 w-full" placeholder={`Ej: ${form.brandName || "Louis Vuitton"} Speedy 30 monogram`} />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</label>
            <textarea value={form.description} onChange={(e) => update({ description: e.target.value })}
              className="input mt-1 w-full min-h-[80px] text-sm" placeholder="Describe el estado, antigüedad, accesorios incluidos..." />
          </div>

          {/* Condición */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Condición</label>
            <div className="mt-2 space-y-2">
              {CONDITIONS.map((c) => (
                <label key={c.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${form.condition === c.value ? "border-trust bg-trust/5" : "border-border"}`}>
                  <input type="radio" name="condition" value={c.value} checked={form.condition === c.value} onChange={() => update({ condition: c.value })} className="mt-0.5 accent-[var(--trust)]" />
                  <div>
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Talla */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Talla</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} onClick={() => update({ size: s })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${form.size === s ? "border-trust bg-trust/10 text-trust" : "border-border"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio (CLP)</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input type="number" value={form.priceCLP || ""} onChange={(e) => update({ priceCLP: parseInt(e.target.value) || 0 })}
                className="input w-full pl-8" placeholder="50000" inputMode="numeric" />
            </div>
            {form.priceCLP > 0 && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Recibirás aprox. <span className="font-semibold text-foreground">{formatCLP(Math.round(form.priceCLP * 0.88))}</span> tras comisión del 12%
              </p>
            )}
          </div>
        </div>
      )}

      {/* PASO 3 — Confirmar y publicar */}
      {step === 3 && (
        <div className="px-4 pt-5 space-y-4">
          <h2 className="font-display text-xl font-semibold">Revisa y publica</h2>

          {/* Preview */}
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="flex gap-3 p-3">
              {form.photoUrls[0] && <img src={form.photoUrls[0]} className="h-20 w-20 rounded-xl object-cover shrink-0" alt="" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{form.brandName}</p>
                <p className="text-sm font-medium line-clamp-2">{form.title}</p>
                <p className="mt-1 text-sm font-semibold">{formatCLP(form.priceCLP)}</p>
                <p className="text-xs text-muted-foreground">{form.photos.length} fotos · Talla {form.size}</p>
              </div>
            </div>
          </div>

          {/* Compromisos */}
          <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-trust" />
              <p className="text-sm font-semibold">Al publicar confirmas que:</p>
            </div>
            {[
              "El artículo es 100% auténtico y de la marca indicada.",
              "La descripción y fotos representan fielmente el artículo.",
              "Enviarás el artículo a Trueki dentro de 48h tras la venta.",
              "Artículos falsos resultan en strike y ban permanente.",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-trust shrink-0 mt-0.5" /><span>{t}</span>
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
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background safe-bottom">
        <div className="mx-auto max-w-[480px] p-3">
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as 2 | 3)}
              disabled={step === 1 ? !canNext1 : !canNext2}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {step === 1 ? `Continuar (${form.photos.length}/${minPhotos} fotos)` : "Revisar publicación"}
            </button>
          ) : (
            <button onClick={handlePublish} disabled={loading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {loading ? "Publicando..." : "Publicar ahora"}
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
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
        <Check className="h-10 w-10" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-semibold">¡Publicado!</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Tu artículo ya está visible. Te notificaremos por WhatsApp cuando alguien lo compre.
      </p>
      <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
        <button onClick={() => navigate({ to: "/seller/dashboard" })} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Ver mis publicaciones
        </button>
        <button onClick={onNew} className="rounded-full border border-border px-6 py-3 text-sm font-medium">
          Publicar otro artículo
        </button>
      </div>
    </div>
  );
}
