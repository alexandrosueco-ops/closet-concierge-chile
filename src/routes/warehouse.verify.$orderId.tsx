import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Camera, X, Check, AlertTriangle, Upload, RotateCcw, ZoomIn, Package, ShieldCheck, FileText } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatCLP } from "@/hooks/useListings";

export const Route = createFileRoute("/warehouse/verify/$orderId")({
  component: () => <AuthGuard requiredRoles={["warehouse","admin"]}><VerifyPage /></AuthGuard>,
});

// Checklists por riesgo de marca
const CHECKLISTS: Record<string, string[]> = {
  high: [
    "Caja y dustbag originales presentes",
    "Hologram/fecha code auténtico",
    "Costuras uniformes y simétricas",
    "Materiales: peso, textura, olor",
    "Herrajes: peso, acabado, grabado",
    "Logo: tipografía y posicionamiento",
    "Interior: forro, etiqueta de serie",
    "Modelo y referencia correctos",
  ],
  medium: [
    "Etiqueta con código auténtico",
    "Costuras y acabados generales",
    "Materiales y acabados",
    "Logo y branding correcto",
  ],
  low: [
    "Estado general corresponde",
    "Sin daños ocultos",
    "Etiqueta y talla correctos",
  ],
};

type Verdict = "authentic" | "suspicious" | "fake" | null;
type Step = "receive" | "checklist" | "photos" | "verdict" | "done";

interface ListingData {
  id: string; title: string; description: string | null;
  condition: string; size: string | null; price_clp: number;
  status: string; warehouse_notes: string | null; reject_reason: string | null;
  brands: { name: string; risk_level: string } | null;
  categories: { name: string } | null;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
  listing_photos: { id: string; url: string; position: number }[];
}

function VerifyPage() {
  const { orderId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("receive");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [photos, setPhotos] = useState<{ file: File; url: string; label: string }[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<{ id: string; url: string; position: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef("");

  const PHOTO_LABELS = [
    "Frontal completo","Trasero completo","Lateral izquierdo","Lateral derecho",
    "Interior completo","Detalle logo","Detalle costuras","Detalle herrajes",
    "Código/Serial/Fecha","Etiqueta original","Estado general","Defecto (si aplica)",
  ];

  const load = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("listings")
      .select(`id,title,description,condition,size,price_clp,status,warehouse_notes,reject_reason,
        brands(name,risk_level),categories(name),
        profiles!seller_id(display_name,avatar_url),
        listing_photos(id,url,position)`)
      .eq("id", orderId)
      .single();
    if (data) {
      setListing(data as ListingData);
      setExistingPhotos((data.listing_photos ?? []).sort((a: any, b: any) => a.position - b.position));
      if (data.status === "received") setStep("checklist");
      if (data.status === "in_verification") setStep("photos");
    }
    setLoading(false);
  }, [orderId]);

  useEffect(() => { load(); }, [load]);

  const riskLevel = listing?.brands?.risk_level ?? "low";
  const checklist = CHECKLISTS[riskLevel] ?? CHECKLISTS.low;
  const checksComplete = checklist.every(item => checks[item]);
  const hasEnoughPhotos = existingPhotos.length + photos.length >= (riskLevel === "high" ? 6 : 3);

  // ── MARCAR RECIBIDO ──────────────────────────────────────────────────────────
  const markReceived = async () => {
    setSaving(true);
    await (supabase as any).from("listings").update({
      status: "received",
      warehouse_received_at: new Date().toISOString(),
    }).eq("id", orderId);
    await (supabase as any).from("warehouse_sessions").insert({
      user_id: user?.id, listing_id: orderId, action: "received",
    });
    setSaving(false);
    setStep("checklist");
    load();
  };

  // ── SUBIR FOTO ───────────────────────────────────────────────────────────────
  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const label = labelRef.current || `Foto ${existingPhotos.length + photos.length + 1}`;
    const newPhotos = files.map(f => ({ file: f, url: URL.createObjectURL(f), label }));
    setPhotos(prev => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const removeNewPhoto = (i: number) => {
    setPhotos(prev => prev.filter((_, j) => j !== i));
  };

  const deleteExistingPhoto = async (photoId: string) => {
    await (supabase as any).from("listing_photos").delete().eq("id", photoId);
    setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const uploadAllPhotos = async () => {
    if (!photos.length) return;
    setUploading(true);
    const startPos = existingPhotos.length;
    for (let i = 0; i < photos.length; i++) {
      const { file, label } = photos[i];
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${orderId}/pro-${Date.now()}-${i}.${ext}`;
      const { data: storageData } = await supabase.storage
        .from("listing-photos")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (storageData) {
        const { data: urlData } = supabase.storage.from("listing-photos").getPublicUrl(path);
        await (supabase as any).from("listing_photos").insert({
          listing_id: orderId,
          url: urlData.publicUrl,
          position: startPos + i,
          label,
        });
      }
    }
    await (supabase as any).from("warehouse_sessions").insert({
      user_id: user?.id, listing_id: orderId, action: "photo_uploaded",
      metadata: { count: photos.length },
    });
    setPhotos([]);
    setUploading(false);
    load();
  };

  // ── GUARDAR VEREDICTO ────────────────────────────────────────────────────────
  const saveVerdict = async () => {
    if (!verdict) return;
    setSaving(true);
    const newStatus = verdict === "authentic" ? "published"
      : verdict === "suspicious" ? "in_verification"
      : "rejected";

    await (supabase as any).from("listings").update({
      status: newStatus,
      warehouse_notes: notes || null,
      reject_reason: verdict === "fake" ? rejectReason : null,
      warehouse_verified_at: new Date().toISOString(),
      warehouse_verified_by: user?.id,
    }).eq("id", orderId);

    await (supabase as any).from("warehouse_sessions").insert({
      user_id: user?.id, listing_id: orderId,
      action: verdict === "authentic" ? "verify_done" : "verify_rejected",
      notes: notes || null,
      metadata: { verdict, reject_reason: rejectReason },
    });
    setSaving(false);
    setStep("done");
  };

  if (loading) return (
    <div className="app-shell flex min-h-dvh items-center justify-center">
      <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>
    </div>
  );

  if (!listing) return (
    <div className="app-shell flex min-h-dvh items-center justify-center px-6 text-center">
      <p>Artículo no encontrado</p>
    </div>
  );

  const stepProgress = { receive:0, checklist:1, photos:2, verdict:3, done:4 }[step];

  return (
    <div className="app-shell pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-2 border-border bg-background safe-top">
        <div className="flex h-14 items-center gap-3 px-3">
          <button onClick={() => navigate({ to: "/warehouse/inbound" })}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm truncate">{listing.title}</p>
            <p className="text-[10px] text-muted-foreground">{listing.brands?.name} · {listing.profiles?.display_name}</p>
          </div>
          <div className="flex items-center gap-1">
            {["Recibir","Checklist","Fotos","Veredicto"].map((s, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i < stepProgress ? "bg-primary" : i === stepProgress - 1 ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </header>

      {/* Foto preview modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setPreviewPhoto(null)}>
          <img src={previewPhoto} className="max-h-[90dvh] max-w-[95vw] rounded-2xl object-contain" alt="" />
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      )}

      <div className="px-4 pt-4 space-y-4">

        {/* Info del artículo — siempre visible */}
        <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
          {existingPhotos.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto p-2 border-b border-border">
              {existingPhotos.map(p => (
                <div key={p.id} className="relative shrink-0">
                  <img src={p.url} className="h-16 w-16 rounded-lg object-cover cursor-pointer"
                    onClick={() => setPreviewPhoto(p.url)} alt="" />
                </div>
              ))}
            </div>
          )}
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{listing.brands?.name}</p>
                <p className="font-black text-base" style={{ letterSpacing: "-0.02em" }}>{listing.title}</p>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                riskLevel === "high" ? "bg-red-100 text-red-700" :
                riskLevel === "medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
              }`}>Riesgo {riskLevel === "high" ? "ALTO" : riskLevel === "medium" ? "MEDIO" : "BAJO"}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-2 py-0.5">{listing.categories?.name}</span>
              <span className="rounded-full border border-border px-2 py-0.5">{listing.condition.replace("_"," ")}</span>
              {listing.size && <span className="rounded-full border border-border px-2 py-0.5">T. {listing.size}</span>}
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 font-bold text-foreground">{formatCLP(listing.price_clp)}</span>
            </div>
            {listing.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{listing.description}</p>
            )}
          </div>
        </div>

        {/* ── PASO: RECIBIR ────────────────────────────────────────────────── */}
        {step === "receive" && (
          <div className="space-y-3">
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-center">
              <Package className="mx-auto h-10 w-10 text-amber-600 mb-3" />
              <h2 className="font-black text-lg mb-1" style={{ letterSpacing: "-0.02em" }}>¿Recibiste el artículo?</h2>
              <p className="text-sm text-muted-foreground mb-5">Confirma que el paquete llegó al centro de verificación antes de empezar.</p>
              <button onClick={markReceived} disabled={saving}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-black disabled:opacity-60">
                {saving ? "Guardando..." : "✓ Confirmar recepción"}
              </button>
            </div>
          </div>
        )}

        {/* ── PASO: CHECKLIST ──────────────────────────────────────────────── */}
        {step === "checklist" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base" style={{ letterSpacing: "-0.02em" }}>
                <ShieldCheck className="inline h-4 w-4 mr-1.5" />
                Checklist de autenticación
              </h2>
              <span className="text-sm font-black text-primary">
                {Object.values(checks).filter(Boolean).length}/{checklist.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${(Object.values(checks).filter(Boolean).length / checklist.length) * 100}%` }} />
            </div>

            <div className="space-y-2">
              {checklist.map((item, i) => (
                <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition-all ${checks[item] ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${checks[item] ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                    {checks[item] && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={!!checks[item]}
                    onChange={e => setChecks(prev => ({ ...prev, [item]: e.target.checked }))} />
                  <span className={`text-sm ${checks[item] ? "font-bold line-through text-muted-foreground" : "font-medium"}`}>{item}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Notas de verificación</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                className="input w-full min-h-[80px]" placeholder="Observaciones, detalles importantes, dudas..." />
            </div>
          </div>
        )}

        {/* ── PASO: FOTOS ──────────────────────────────────────────────────── */}
        {step === "photos" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base" style={{ letterSpacing: "-0.02em" }}>
                <Camera className="inline h-4 w-4 mr-1.5" />
                Fotos profesionales
              </h2>
              <span className={`text-sm font-black ${hasEnoughPhotos ? "text-green-600" : "text-amber-600"}`}>
                {existingPhotos.length + photos.length}/{riskLevel === "high" ? 6 : 3} mín.
              </span>
            </div>

            {/* Fotos existentes */}
            {existingPhotos.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Fotos de referencia del vendedor</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingPhotos.map(p => (
                    <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                      <img src={p.url} className="h-full w-full object-cover cursor-pointer" onClick={() => setPreviewPhoto(p.url)} alt="" />
                      <button onClick={() => deleteExistingPhoto(p.id)}
                        className="absolute right-1 top-1 h-5 w-5 rounded-full bg-destructive/90 flex items-center justify-center">
                        <X className="h-3 w-3 text-white" />
                      </button>
                      <button onClick={() => setPreviewPhoto(p.url)}
                        className="absolute left-1 bottom-1 h-5 w-5 rounded-full bg-black/50 flex items-center justify-center">
                        <ZoomIn className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fotos nuevas pendientes de subir */}
            {photos.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Fotos profesionales (por subir)</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {photos.map((p, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted border-2 border-primary/30">
                      <img src={p.url} className="h-full w-full object-cover cursor-pointer" onClick={() => setPreviewPhoto(p.url)} alt="" />
                      <button onClick={() => removeNewPhoto(i)}
                        className="absolute right-1 top-1 h-5 w-5 rounded-full bg-destructive/90 flex items-center justify-center">
                        <X className="h-3 w-3 text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                        <p className="text-[8px] text-white truncate">{p.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={uploadAllPhotos} disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-black text-background disabled:opacity-60">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Subiendo..." : `Subir ${photos.length} foto${photos.length > 1 ? "s" : ""}`}
                </button>
              </div>
            )}

            {/* Botones por tipo de foto */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Agregar foto</p>
              <div className="grid grid-cols-2 gap-2">
                {PHOTO_LABELS.map(label => (
                  <button key={label} onClick={() => { labelRef.current = label; fileRef.current?.click(); }}
                    className="flex items-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-2.5 text-left text-xs font-bold hover:bg-muted transition-colors active:scale-[0.97]">
                    <Camera className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
              <input ref={fileRef} type="file" accept="image/*,image/heic" multiple className="hidden" onChange={addPhoto} capture="environment" />
            </div>
          </div>
        )}

        {/* ── PASO: VEREDICTO ──────────────────────────────────────────────── */}
        {step === "verdict" && (
          <div className="space-y-3">
            <h2 className="font-black text-base" style={{ letterSpacing: "-0.02em" }}>Veredicto final</h2>

            {[
              { v: "authentic", label: "✓ Auténtico — Publicar", sub: "El artículo es 100% original. Se publica en Trueki.", color: "border-green-300 bg-green-50 text-green-800" },
              { v: "suspicious", label: "? Dudoso — Revisar más", sub: "Hay dudas. Queda en verificación para segunda revisión.", color: "border-amber-300 bg-amber-50 text-amber-800" },
              { v: "fake",       label: "✗ Falso — Rechazar", sub: "El artículo no es auténtico. Se devuelve al vendedor.", color: "border-red-300 bg-red-50 text-red-800" },
            ].map(({ v, label, sub, color }) => (
              <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all ${verdict === v ? color : "border-border bg-card"}`}>
                <input type="radio" name="verdict" className="mt-1 accent-[#dadd48]" checked={verdict === v}
                  onChange={() => setVerdict(v as Verdict)} />
                <div><p className="text-sm font-black">{label}</p><p className="text-xs text-muted-foreground mt-0.5">{sub}</p></div>
              </label>
            ))}

            {verdict === "fake" && (
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Razón del rechazo *</label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  className="input w-full min-h-[80px]" placeholder="Describe qué hace que el artículo sea falso (ej: logo mal posicionado, costura asimétrica, herraje liviano...)" />
              </div>
            )}

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-1">Notas adicionales</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                className="input w-full min-h-[70px]" placeholder="Notas para el equipo o para el vendedor..." />
            </div>

            {verdict && verdict !== "fake" && (
              <div className="rounded-xl bg-primary/10 border-2 border-primary/20 p-3">
                <p className="text-xs font-bold">
                  {verdict === "authentic" ? "✓ El artículo se publicará inmediatamente en Trueki." : "? El artículo quedará en estado 'en verificación' para segunda revisión."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── DONE ─────────────────────────────────────────────────────────── */}
        {step === "done" && (
          <div className="rounded-2xl border-2 border-border p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mx-auto mb-4">
              {verdict === "authentic" ? <Check className="h-8 w-8" /> :
               verdict === "fake" ? <AlertTriangle className="h-8 w-8 text-destructive" /> :
               <RotateCcw className="h-8 w-8 text-amber-600" />}
            </div>
            <h2 className="font-black text-xl mb-1" style={{ letterSpacing: "-0.03em" }}>
              {verdict === "authentic" ? "¡Publicado en Trueki!" :
               verdict === "fake" ? "Artículo rechazado" : "En revisión adicional"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {verdict === "authentic" ? "El artículo ya está disponible para compradores." :
               verdict === "fake" ? "Se notificará al vendedor con la razón del rechazo." :
               "El equipo hará una segunda revisión."}
            </p>
            <button onClick={() => navigate({ to: "/warehouse/inbound" })}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-black">
              Volver al inbound
            </button>
          </div>
        )}
      </div>

      {/* ── CTA FIJO POR PASO ────────────────────────────────────────────────── */}
      {step !== "receive" && step !== "done" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background safe-bottom">
          <div className="mx-auto max-w-[480px] p-3 flex gap-2">
            {step !== "checklist" && (
              <button onClick={() => { const backMap: Partial<Record<Step,Step>> = { photos:"checklist", verdict:"photos" }; setStep(backMap[step] ?? "checklist"); }}
                className="rounded-full border-2 border-border px-4 py-3 text-sm font-black">
                ← Atrás
              </button>
            )}
            <button
              onClick={() => {
                if (step === "checklist") { setStep("photos"); (supabase as any).from("listings").update({ status:"in_verification" }).eq("id",orderId); }
                else if (step === "photos") setStep("verdict");
                else if (step === "verdict") saveVerdict();
              }}
              disabled={
                (step === "checklist" && !checksComplete) ||
                (step === "photos" && !hasEnoughPhotos) ||
                (step === "verdict" && (!verdict || (verdict === "fake" && !rejectReason))) ||
                saving || uploading
              }
              className="flex-1 rounded-full bg-primary py-3.5 text-sm font-black disabled:opacity-40">
              {saving ? "Guardando..." :
               step === "checklist" ? `Continuar (${Object.values(checks).filter(Boolean).length}/${checklist.length} ✓)` :
               step === "photos" ? `Continuar (${existingPhotos.length + photos.length} fotos)` :
               "Guardar veredicto"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
