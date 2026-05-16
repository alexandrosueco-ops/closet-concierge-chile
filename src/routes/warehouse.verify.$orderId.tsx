import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Camera, Check, X, AlertTriangle, Printer, Upload } from "lucide-react";

export const Route = createFileRoute("/warehouse/verify/$orderId")({
  head: () => ({ meta: [{ title: "Verificación — Trueki Bodega" }] }),
  component: VerifyPage,
});

type Verdict = "pass" | "fail" | "uncertain" | null;
type Grade = "nuevo" | "como_nuevo" | "muy_bueno" | "bueno" | null;
type Outcome = "approved" | "rejected" | "mismatch" | null;

const MOCK_ORDER = {
  id: "ORD-X9Y8Z7",
  brand: "Louis Vuitton",
  title: "Speedy 30 monogram",
  seller: "Valentina M.",
  riskLevel: "alta",
  requiredPhotos: 6,
  listingPhotos: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
  ],
  checklist: [
    "Verificar logo LV (posicionamiento y relieve)",
    "Revisar costuras (uniformidad y color del hilo)",
    "Comprobar herrajes (peso y acabado)",
    "Revisar interior (fecha code, forro)",
    "Verificar etiqueta y serial",
    "Olor del cuero (auténtico LV tiene olor característico)",
  ],
};

function VerifyPage() {
  const { orderId } = Route.useParams();
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [grade, setGrade] = useState<Grade>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [mismatches, setMismatches] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome>(null);

  const canSubmit = verdict !== null && grade !== null && photos.length >= MOCK_ORDER.requiredPhotos;

  const handleSubmit = () => {
    if (verdict === "pass") setOutcome("approved");
    else if (verdict === "fail") setOutcome("rejected");
    else setOutcome("mismatch");
  };

  if (outcome) return <OutcomeScreen outcome={outcome} orderId={orderId} />;

  return (
    <div className="app-shell pb-36">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <Link to="/warehouse/inbound" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-base font-semibold leading-tight">Verificación</h1>
          <p className="text-[11px] text-muted-foreground">#{orderId} · {MOCK_ORDER.brand}</p>
        </div>
        <span className="ml-auto rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
          RIESGO {MOCK_ORDER.riskLevel.toUpperCase()}
        </span>
      </header>

      <div className="space-y-5 px-4 pt-4">
        {/* Artículo */}
        <Block title="Artículo recibido">
          <p className="text-sm text-muted-foreground">{MOCK_ORDER.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Vendedor: {MOCK_ORDER.seller}</p>
          <div className="mt-3 flex gap-2 overflow-x-auto -mx-1 px-1">
            {MOCK_ORDER.listingPhotos.map((p, i) => (
              <img key={i} src={p} className="h-20 w-20 shrink-0 rounded-xl object-cover" alt="" />
            ))}
          </div>
        </Block>

        {/* Checklist por marca */}
        <Block title={`Checklist ${MOCK_ORDER.brand}`}>
          <div className="space-y-2">
            {MOCK_ORDER.checklist.map((item, i) => (
              <CheckItem key={i} text={item} />
            ))}
          </div>
        </Block>

        {/* Veredicto de autenticidad */}
        <Block title="Veredicto de autenticidad">
          <div className="grid grid-cols-3 gap-2">
            <VerdictBtn active={verdict === "pass"} onClick={() => setVerdict("pass")} icon={<Check className="h-4 w-4" />} label="Auténtico" tone="success" />
            <VerdictBtn active={verdict === "uncertain"} onClick={() => setVerdict("uncertain")} icon={<AlertTriangle className="h-4 w-4" />} label="Dudoso" tone="warning" />
            <VerdictBtn active={verdict === "fail"} onClick={() => setVerdict("fail")} icon={<X className="h-4 w-4" />} label="Falso" tone="destructive" />
          </div>
        </Block>

        {/* Condición */}
        <Block title="Condición del artículo">
          <div className="grid grid-cols-2 gap-2">
            {(["nuevo", "como_nuevo", "muy_bueno", "bueno"] as const).map((g) => (
              <button key={g} onClick={() => setGrade(g)} className={`rounded-xl border p-3 text-sm font-medium text-left ${grade === g ? "border-trust bg-trust/5" : "border-border"}`}>
                <span className="capitalize">{g.replace("_", " ")}</span>
              </button>
            ))}
          </div>
        </Block>

        {/* Discrepancias */}
        <Block title="Discrepancias vs. publicación">
          <div className="space-y-2">
            {["Condición diferente a lo declarado", "Accesorios faltantes (dustbag, etc)", "Tamaño incorrecto", "Color diferente"].map((d) => (
              <label key={d} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-[var(--trust)] rounded"
                  checked={mismatches.includes(d)}
                  onChange={(e) => setMismatches(e.target.checked ? [...mismatches, d] : mismatches.filter((m) => m !== d))}
                />
                <span className="text-sm">{d}</span>
              </label>
            ))}
          </div>
        </Block>

        {/* Fotos de evidencia */}
        <Block title={`Evidencia fotográfica (${photos.length}/${MOCK_ORDER.requiredPhotos} requeridas)`}>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <img src={p} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {photos.length < 10 && (
              <button
                onClick={() => setPhotos([...photos, `https://picsum.photos/seed/${Date.now()}/200`])}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted"
              >
                <Camera className="h-5 w-5" />
                <span className="text-[10px]">Foto</span>
              </button>
            )}
          </div>
          {photos.length < MOCK_ORDER.requiredPhotos && (
            <p className="mt-2 text-xs text-warning">
              Faltan {MOCK_ORDER.requiredPhotos - photos.length} foto(s) requerida(s) para esta marca
            </p>
          )}
        </Block>

        {/* Notas */}
        <Block title="Notas internas">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input min-h-[80px] text-sm" placeholder="Observaciones, dudas o comentarios sobre la verificación..." />
        </Block>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background safe-bottom">
        <div className="mx-auto flex max-w-[480px] flex-col gap-2 p-3">
          {!canSubmit && (
            <p className="text-center text-xs text-muted-foreground">
              {verdict === null ? "Selecciona un veredicto" : grade === null ? "Selecciona la condición" : `Agrega ${MOCK_ORDER.requiredPhotos - photos.length} foto(s) más`}
            </p>
          )}
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-full border border-border px-4 py-3 text-sm font-medium">
              <Printer className="h-4 w-4" /> Imprimir
            </button>
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Enviar veredicto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutcomeScreen({ outcome, orderId }: { outcome: Outcome; orderId: string }) {
  return (
    <div className="app-shell flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${outcome === "approved" ? "bg-success/10 text-success" : outcome === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
        {outcome === "approved" ? <Check className="h-10 w-10" /> : outcome === "rejected" ? <X className="h-10 w-10" /> : <AlertTriangle className="h-10 w-10" />}
      </div>
      <h1 className="mt-4 font-display text-2xl font-semibold">
        {outcome === "approved" ? "¡Aprobado!" : outcome === "rejected" ? "Artículo rechazado" : "Decisión del comprador"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        {outcome === "approved"
          ? "El artículo es auténtico. Genera la etiqueta outbound y despacha al comprador."
          : outcome === "rejected"
          ? "Artículo falso detectado. Se cancela la orden y se reembolsa al comprador. Se aplica strike al vendedor."
          : "Hay discrepancias. El comprador debe decidir si acepta o cancela la orden."
        }
      </p>
      <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
        {outcome === "approved" && (
          <Link to="/warehouse/outbound" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground text-center">
            Generar etiqueta outbound
          </Link>
        )}
        <Link to="/warehouse/inbound" className="rounded-full border border-border px-6 py-3 text-sm font-medium text-center">
          Volver a inbound
        </Link>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function VerdictBtn({ active, onClick, icon, label, tone }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; tone: string }) {
  const toneMap: Record<string, string> = {
    success: "border-success bg-success/5 text-success",
    warning: "border-warning bg-warning/5 text-warning",
    destructive: "border-destructive bg-destructive/5 text-destructive",
  };
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-xs font-semibold transition-all ${active ? toneMap[tone] : "border-border text-muted-foreground"}`}>
      {icon}
      {label}
    </button>
  );
}

function CheckItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className={`flex cursor-pointer items-start gap-2.5 rounded-lg p-2 transition-colors ${checked ? "bg-success/5" : "hover:bg-muted/50"}`}>
      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-success bg-success" : "border-border"}`} onClick={() => setChecked(!checked)}>
        {checked && <Check className="h-2.5 w-2.5 text-white" />}
      </div>
      <span className={`text-xs leading-relaxed ${checked ? "line-through text-muted-foreground" : ""}`}>{text}</span>
    </label>
  );
}
