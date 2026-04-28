import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Camera, Check, X, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/warehouse/verify/$orderId")({
  head: () => ({ meta: [{ title: "Verificación — VeriCloset" }] }),
  component: VerifyPage,
});

type Authenticity = "pass" | "fail" | "uncertain" | null;
type Grade = "nuevo" | "como_nuevo" | "muy_bueno" | "bueno" | null;

function VerifyPage() {
  const { orderId } = Route.useParams();
  const [auth, setAuth] = useState<Authenticity>(null);
  const [grade, setGrade] = useState<Grade>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  return (
    <div className="app-shell pb-32">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <Link to="/warehouse/inbound" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-base font-semibold leading-tight">Verificación</h1>
          <p className="text-[11px] text-muted-foreground">#{orderId}</p>
        </div>
      </header>

      <div className="space-y-5 px-4 pt-4">
        <Block title="Autenticidad">
          <div className="grid grid-cols-3 gap-2">
            <AuthBtn active={auth === "pass"} onClick={() => setAuth("pass")} icon={<Check className="h-4 w-4" />} label="Auténtico" tone="success" />
            <AuthBtn active={auth === "uncertain"} onClick={() => setAuth("uncertain")} icon={<AlertTriangle className="h-4 w-4" />} label="Dudoso" tone="warning" />
            <AuthBtn active={auth === "fail"} onClick={() => setAuth("fail")} icon={<X className="h-4 w-4" />} label="Falso" tone="destructive" />
          </div>
        </Block>

        <Block title="Condición">
          <div className="grid grid-cols-2 gap-2">
            {(["nuevo", "como_nuevo", "muy_bueno", "bueno"] as const).map((g) => (
              <button key={g} onClick={() => setGrade(g)}
                className={`rounded-xl border p-3 text-sm font-medium ${grade === g ? "border-trust bg-trust/5" : "border-border"}`}>
                {g.replace("_", " ")}
              </button>
            ))}
          </div>
        </Block>

        <Block title="Evidencia fotográfica">
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <img src={p} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            <button onClick={() => setPhotos([...photos, `https://picsum.photos/seed/${Date.now()}/200`])}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border">
              <Camera className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </Block>

        <Block title="Notas">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input min-h-[80px]" placeholder="Comentarios o discrepancias..." />
        </Block>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background safe-bottom">
        <div className="mx-auto flex max-w-[480px] gap-2 p-3">
          <Link to="/warehouse/outbound" className="flex-1 rounded-full border border-border py-3 text-center text-sm font-semibold">Reportar problema</Link>
          <Link to="/warehouse/outbound"
            className="flex-[1.5] rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">
            Aprobar y enviar
          </Link>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </section>
  );
}

function AuthBtn({ active, onClick, icon, label, tone }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; tone: "success" | "warning" | "destructive" }) {
  const map = {
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold ${active ? `${map[tone]} border-transparent` : "border-border"}`}>
      {icon}{label}
    </button>
  );
}
