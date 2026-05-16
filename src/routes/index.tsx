import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, ShieldCheck, Truck, RotateCcw, ChevronRight, Star, CheckCircle2, Package, Zap } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonList } from "@/components/SkeletonCard";
import { usePublishedListings, useCategories, useBrands } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Trueki — Moda premium verificada en Chile" }] }),
  component: HomePage,
});

const STEPS = [
  { id: 1, icon: <Search className="h-5 w-5" />, title: "Encuentra tu pieza", desc: "Explora artículos premium verificados. Filtra por marca, talla y precio.", screen: "browse" },
  { id: 2, icon: <ShieldCheck className="h-5 w-5" />, title: "Compra con garantía", desc: "Tu pago queda retenido. El artículo pasa por nuestro centro de autenticación en Santiago.", screen: "verify" },
  { id: 3, icon: <Package className="h-5 w-5" />, title: "Recibe autenticado", desc: "Si todo está bien, recibes el artículo. Si no, reembolso del 100%. Sin preguntas.", screen: "receive" },
];

function PhoneScreen({ screen }: { screen: string }) {
  if (screen === "browse") return (
    <div className="h-full p-3 space-y-2">
      <div className="h-6 rounded-xl bg-primary/20 flex items-center px-2 gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
        <div className="h-1.5 w-20 rounded-full bg-primary/30" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["👜 $890K", "👟 $149K", "👛 $620K", "🥿 $320K"].map((item, i) => (
          <div key={i} className="bg-muted rounded-xl p-2">
            <div className="text-xl text-center mb-1">{item.split(" ")[0]}</div>
            <div className="h-1.5 w-12 rounded-full bg-muted-foreground/20 mb-1" />
            <div className="h-2 w-10 rounded-full bg-primary/40" />
            <div className="mt-1 flex items-center gap-0.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-1 w-8 rounded-full bg-primary/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen === "verify") return (
    <div className="h-full p-3 space-y-2">
      <div className="bg-primary rounded-xl p-2 text-center mb-2">
        <p className="text-[9px] font-black text-primary-foreground/70 uppercase tracking-widest">Centro Trueki</p>
        <p className="text-xs font-black text-primary-foreground">Verificando...</p>
      </div>
      {["Autenticidad del material ✓", "Costuras y acabados ✓", "Herrajes y accesorios ✓", "Serial y fecha code..."].map((item, i) => (
        <div key={i} className={`flex items-center gap-2 ${i < 3 ? "opacity-100" : "opacity-40"}`}>
          <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] ${i < 3 ? "bg-green-400 text-white" : "border-2 border-border"}`}>
            {i < 3 ? "✓" : ""}
          </div>
          <div className={`h-1.5 rounded-full ${i < 3 ? "bg-foreground/15" : "bg-muted"}`} style={{ width: `${40 + i * 10}px` }} />
        </div>
      ))}
      <div className="rounded-xl bg-primary/10 p-2 text-center mt-2">
        <p className="text-[9px] font-black">Verificando... 🔍</p>
      </div>
    </div>
  );

  return (
    <div className="h-full p-3 space-y-2">
      <div className="bg-green-50 rounded-xl p-2 text-center border-2 border-green-100">
        <div className="mx-auto h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-white font-black text-sm mb-1">✓</div>
        <p className="text-[9px] font-black text-green-700 uppercase tracking-widest">Autenticado</p>
        <p className="text-xs font-black text-green-800">¡En camino a ti!</p>
      </div>
      {["Pago retenido", "Verificado ✓", "Enviado Chilexpress", "48h protección"].map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full flex-shrink-0 ${i < 3 ? "bg-green-400" : "bg-primary animate-pulse"}`} />
          <div className={`h-1.5 rounded-full ${i < 3 ? "bg-foreground/15" : "bg-muted"}`} style={{ width: `${45 + i * 8}px` }} />
        </div>
      ))}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-2 text-center">
        <p className="text-[9px] font-black">Pago liberado en 48h</p>
      </div>
    </div>
  );
}

function HomePage() {
  const { user } = useAuth();
  const { listings, loading } = usePublishedListings({ limit: 8 });
  const categories = useCategories();
  const brands = useBrands();
  const [activeStep, setActiveStep] = useState(0);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setActiveStep((s) => (s + 1) % STEPS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const filteredListings = activeCat ? listings.filter((l) => l.category_id === activeCat) : listings;

  return (
    <div className="app-shell pb-24">
      <AppHeader showLogo />

      {/* HERO */}
      <section className="relative overflow-hidden bg-primary mx-4 mt-4 rounded-3xl p-6">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1 mb-3">
            <Zap className="h-3 w-3 text-foreground/60" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">verificado · chile</span>
          </div>
          <h1 className="font-black text-3xl leading-tight" style={{ letterSpacing: "-0.04em" }}>
            Moda premium.<br /><span className="text-foreground/60">Sin riesgos.</span>
          </h1>
          <p className="mt-2 text-sm text-foreground/60 leading-relaxed">Compra y vende ropa de marca con autenticación garantizada.</p>
          <div className="mt-5 flex gap-2">
            <Link to="/search" className="flex-1 rounded-full bg-foreground py-3 text-center text-sm font-black text-background">Explorar →</Link>
            <Link to="/sell" className="flex-1 rounded-full border-2 border-foreground/30 py-3 text-center text-sm font-black">Vender</Link>
          </div>
        </div>
      </section>

      {/* BÚSQUEDA */}
      <div className="px-4 mt-4">
        <Link to="/search" className="flex items-center gap-3 rounded-2xl border-2 border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" /><span>Buscar marca, artículo, talla...</span>
        </Link>
      </div>

      {/* STATS */}
      <section className="mt-5 px-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: "94.2%", label: "Autenticidad", icon: <ShieldCheck className="h-4 w-4" /> },
            { val: "48h",   label: "Protección",   icon: <CheckCircle2 className="h-4 w-4" /> },
            { val: "100%",  label: "Reembolso",    icon: <RotateCcw className="h-4 w-4" /> },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border-2 border-border bg-card p-3 text-center">
              <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-primary-foreground">{s.icon}</div>
              <p className="font-black text-base" style={{ letterSpacing: "-0.04em" }}>{s.val}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA — DEMO ANIMADA */}
      <section className="mt-6 px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-black text-lg" style={{ letterSpacing: "-0.03em" }}>¿Cómo funciona?</h2>
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-black">Demo en vivo</span>
        </div>
        <div className="rounded-3xl border-2 border-border bg-card overflow-hidden">
          {/* Teléfono animado */}
          <div className="bg-muted/30 p-4">
            <div className="mx-auto w-36 h-52 bg-white rounded-2xl border-2 border-border overflow-hidden shadow-sm relative">
              <div className="bg-muted/50 px-3 py-1.5 flex items-center gap-1.5 border-b border-border">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                <div className="h-1 flex-1 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="relative h-[calc(100%-28px)]">
                {STEPS.map((s, i) => (
                  <div key={s.id} className={`absolute inset-0 transition-all duration-500 ${i === activeStep ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <PhoneScreen screen={s.screen} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pasos */}
          <div className="p-4 space-y-1">
            {STEPS.map((step, i) => (
              <button key={step.id} onClick={() => setActiveStep(i)}
                className={`w-full flex items-start gap-3 rounded-2xl p-3 text-left transition-all ${i === activeStep ? "bg-primary/10 border-2 border-primary/30" : "border-2 border-transparent hover:bg-muted/50"}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${i === activeStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-black ${i === activeStep ? "" : "text-muted-foreground"}`} style={{ letterSpacing: "-0.02em" }}>
                    {step.id}. {step.title}
                  </p>
                  {i === activeStep && <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{step.desc}</p>}
                </div>
                {i === activeStep && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1 animate-pulse" />}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="px-4 pb-4 flex gap-1">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i === activeStep ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS */}
      <section className="mt-6">
        <p className="px-4 mb-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Marcas verificadas</p>
        <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
          {(brands.length > 0 ? brands : [{ id: "1", name: "Louis Vuitton" }, { id: "2", name: "Gucci" }, { id: "3", name: "Jordan" }, { id: "4", name: "Chanel" }, { id: "5", name: "Balenciaga" }, { id: "6", name: "Nike" }]).map((b) => (
            <div key={b.id} className="shrink-0 rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-xs font-black whitespace-nowrap">{b.name}</div>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      {categories.length > 0 && (
        <section className="mt-5 px-4">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setActiveCat(null)} className={`rounded-full border-2 px-4 py-2 text-sm font-black transition-all ${!activeCat ? "border-primary bg-primary" : "border-border bg-card"}`}>Todo</button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-black transition-all ${activeCat === c.id ? "border-primary bg-primary" : "border-border bg-card"}`}>
                {c.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* FEED */}
      <section className="mt-5 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-black text-lg" style={{ letterSpacing: "-0.03em" }}>
            {activeCat ? categories.find(c => c.id === activeCat)?.name : "Recién publicado"}
          </h2>
          <Link to="/search" className="text-xs font-bold text-muted-foreground">Ver todo →</Link>
        </div>
        {loading ? <SkeletonList count={6} /> : filteredListings.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-black">Sin publicaciones</p>
            <Link to="/sell" className="mt-3 inline-flex rounded-full bg-primary px-5 py-2.5 text-xs font-black">Publicar ahora</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 listings-grid">
            {filteredListings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* POR QUÉ TRUEKI */}
      <section className="mt-6 mx-4 rounded-3xl bg-muted/50 border-2 border-border p-5">
        <h3 className="font-black text-base mb-4" style={{ letterSpacing: "-0.03em" }}>¿Por qué Trueki?</h3>
        <div className="space-y-3">
          {[
            { icon: <ShieldCheck className="h-5 w-5" />, t: "Autenticación garantizada", d: "Cada artículo es revisado físicamente por expertos antes de ser enviado." },
            { icon: <RotateCcw className="h-5 w-5" />, t: "Reembolso del 100%", d: "Si el artículo es falso o no corresponde, te devolvemos todo. Sin preguntas." },
            { icon: <Truck className="h-5 w-5" />, t: "Envío incluido", d: "Chilexpress, Starken o CorreosChile. Rastreo en tiempo real desde tu app." },
            { icon: <Star className="h-5 w-5" />, t: "Vendedores verificados", d: "RUT validado, historial y valoraciones públicas para cada vendedor." },
          ].map(({ icon, t, d }, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">{icon}</div>
              <div>
                <p className="text-sm font-black" style={{ letterSpacing: "-0.02em" }}>{t}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="mt-5 px-4">
        <h3 className="font-black text-base mb-3" style={{ letterSpacing: "-0.03em" }}>Lo que dicen nuestros usuarios</h3>
        <div className="space-y-3">
          {[
            { name: "Valentina M.", city: "Las Condes", text: "Compré una cartera LV y llegó exactamente como en las fotos. La verificación me dio mucha confianza.", stars: 5 },
            { name: "Diego R.", city: "Providencia", text: "Vendí mis Jordan en 3 días. El proceso es simple y el pago llegó sin problemas.", stars: 5 },
            { name: "Camila F.", city: "Ñuñoa", text: "Un artículo fue rechazado por falso y me devolvieron el dinero al instante. Eso es confianza real.", stars: 5 },
          ].map((r, i) => (
            <div key={i} className="rounded-2xl border-2 border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-black text-sm">{r.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-black" style={{ letterSpacing: "-0.02em" }}>{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.city}</p>
                </div>
                <div className="ml-auto flex">{Array.from({ length: r.stars }).map((_, si) => <Star key={si} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA VENDER */}
      {!user && (
        <section className="mt-5 mx-4 rounded-3xl border-2 border-primary/30 bg-primary/10 p-5">
          <p className="font-black text-base" style={{ letterSpacing: "-0.02em" }}>¿Tienes artículos premium?</p>
          <p className="mt-1 text-sm text-muted-foreground">Publica gratis. Nosotros verificamos, empacamos y enviamos.</p>
          <div className="mt-4 flex gap-2">
            <Link to="/sell" className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-black">Publicar gratis</Link>
            <Link to="/auth/signup" className="rounded-full border-2 border-border bg-background px-4 py-3 text-sm font-black">Registrarse</Link>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="mt-8 px-4 pb-4 text-center border-t-2 border-border pt-5">
        <p className="font-black text-base" style={{ letterSpacing: "-0.04em" }}>Trueki</p>
        <p className="text-xs text-muted-foreground mt-0.5">Marketplace premium verificado · Santiago, Chile</p>
        <div className="mt-3 flex justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/legal/terms">Términos</Link>
          <Link to="/legal/privacy">Privacidad</Link>
          <Link to="/legal/authenticity">Autenticidad</Link>
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground">© 2025 Trueki. Todos los derechos reservados.</p>
      </footer>

      <BottomTabs />
    </div>
  );
}
