import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, ShieldCheck, X, Check } from "lucide-react";
import { BRANDS, CATEGORIES } from "@/lib/mock-data";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Vender — VeriCloset" }] }),
  component: SellWizard,
});

function SellWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [brand, setBrand] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return <SuccessScreen />;

  return (
    <div className="app-shell pb-32">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <button onClick={() => (step === 1 ? history.back() : setStep((s) => (s - 1) as 1 | 2 | 3))}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-base font-semibold">Publicar artículo</h1>
        <span className="ml-auto text-xs text-muted-foreground">Paso {step} de 3</span>
      </header>

      <div className="px-4">
        <div className="my-3 h-1 rounded-full bg-muted">
          <div className="h-1 rounded-full bg-trust transition-all" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {step === 1 && (
        <section className="px-4">
          <h2 className="font-display text-xl font-semibold">Fotos del artículo</h2>
          <p className="mt-1 text-sm text-muted-foreground">Mínimo 4 fotos. Frontal, trasera, etiqueta y detalles.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <img src={p} className="h-full w-full object-cover" alt="" />
                <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {photos.length < 8 && (
              <button onClick={() => setPhotos([...photos, `https://picsum.photos/seed/${Date.now()}/400`])}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted">
                <Camera className="h-5 w-5" />
                <span className="text-[10px]">Agregar</span>
              </button>
            )}
          </div>
          <BottomCTA disabled={photos.length < 4} onClick={() => setStep(2)} label={`Continuar${photos.length < 4 ? ` (${photos.length}/4)` : ""}`} />
        </section>
      )}

      {step === 2 && (
        <section className="px-4">
          <h2 className="font-display text-xl font-semibold">Detalles</h2>
          <p className="mt-1 text-sm text-muted-foreground">Solo aceptamos marcas premium verificables.</p>

          <Field label="Título"><input className="input" placeholder="Ej: Bolso Speedy 30 monogram" /></Field>

          <Field label="Marca">
            <div className="flex flex-wrap gap-2">
              {BRANDS.slice(0, 10).map((b) => (
                <button key={b.id} onClick={() => setBrand(b.name)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${brand === b.name ? "border-trust bg-trust text-trust-foreground" : "border-border"}`}>
                  {b.name}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Categoría">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${category === c.id ? "border-trust bg-trust text-trust-foreground" : "border-border"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Talla"><input className="input" placeholder="42 / M" /></Field>
            <Field label="Precio CLP"><input className="input" placeholder="120000" inputMode="numeric" /></Field>
          </div>

          <Field label="Descripción">
            <textarea className="input min-h-[100px]" placeholder="Estado, antecedentes, dustbag, etc." />
          </Field>

          <BottomCTA disabled={!brand || !category} onClick={() => setStep(3)} label="Continuar" />
        </section>
      )}

      {step === 3 && (
        <section className="px-4">
          <h2 className="font-display text-xl font-semibold">Reglas de publicación</h2>
          <p className="mt-1 text-sm text-muted-foreground">Confirma antes de publicar.</p>

          <ul className="mt-4 space-y-3">
            {[
              "Solo artículos auténticos. Falsificaciones son baneadas.",
              "Cuando vendas, debes enviar a nuestro centro en 48h.",
              "Pago liberado tras verificación + entrega.",
              "Comisión: 12% + costo de envío.",
            ].map((r) => (
              <li key={r} className="flex gap-3 rounded-xl border border-border p-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-trust" />
                <span className="text-sm">{r}</span>
              </li>
            ))}
          </ul>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-muted p-3">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--trust)]" />
            <span className="text-sm">He leído y acepto los <Link to="/legal/terms" className="font-medium text-trust">términos</Link> y la <Link to="/legal/authenticity" className="font-medium text-trust">política de autenticidad</Link>.</span>
          </label>

          <BottomCTA disabled={!confirmed} onClick={() => setDone(true)} label="Publicar ahora" />
        </section>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function BottomCTA({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background safe-bottom">
      <div className="mx-auto max-w-[480px] p-3">
        <button disabled={disabled} onClick={onClick}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40 flex items-center justify-center gap-2">
          {label} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="app-shell flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-trust/10 text-trust">
        <Check className="h-10 w-10" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-semibold">¡Publicado!</h1>
      <p className="mt-2 text-sm text-muted-foreground">Tu artículo ya está en el feed.</p>
      <Link to="/seller/dashboard" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
        Ir al panel
      </Link>
    </div>
  );
}
