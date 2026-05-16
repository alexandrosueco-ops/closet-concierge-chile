import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonList } from "@/components/SkeletonCard";
import { usePublishedListings, useCategories } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Trueki — Moda premium verificada en Chile" }] }),
  component: HomePage,
});

// ── Ilustraciones SVG ────────────────────────────────────────────────────────

function IllusBrowse() {
  return (
    <svg width="100%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="10" width="300" height="26" rx="13" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <circle cx="30" cy="23" r="5.5" stroke="#cfd4ae" strokeWidth="1.8" fill="none"/>
      <line x1="34" y1="27" x2="38" y2="31" stroke="#cfd4ae" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="44" y="17" width="90" height="12" rx="6" fill="#f0f2e6"/>
      <rect x="10" y="46" width="40" height="16" rx="8" fill="#cfd4ae"/>
      <rect x="56" y="46" width="52" height="16" rx="8" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="114" y="46" width="48" height="16" rx="8" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="10" y="72" width="140" height="100" rx="14" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="10" y="72" width="140" height="60" rx="14" fill="#f5f2ec"/>
      <rect x="10" y="110" width="140" height="22" rx="0" fill="#f5f2ec"/>
      <path d="M62 98 v-9 a18 18 0 0 1 36 0 v9" stroke="#1e2114" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <rect x="58" y="98" width="44" height="34" rx="8" fill="#1e2114" opacity="0.7"/>
      <rect x="74" y="110" width="12" height="3" rx="1.5" fill="#cfd4ae" opacity="0.5"/>
      <rect x="18" y="142" width="56" height="12" rx="6" fill="#cfd4ae"/>
      <rect x="18" y="160" width="72" height="7" rx="3.5" fill="#f0f2e6"/>
      <rect x="170" y="72" width="140" height="100" rx="14" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="170" y="72" width="140" height="60" rx="14" fill="#eef0f5"/>
      <rect x="170" y="110" width="140" height="22" rx="0" fill="#eef0f5"/>
      <path d="M196 118 Q210 103 238 110 Q250 113 248 124 L196 124 Z" fill="#1e2114" opacity="0.65"/>
      <path d="M196 124 L248 124 L246 128 L198 128 Z" fill="#cfd4ae"/>
      <rect x="178" y="142" width="56" height="12" rx="6" fill="#cfd4ae"/>
      <rect x="178" y="160" width="72" height="7" rx="3.5" fill="#f0f2e6"/>
    </svg>
  );
}

function IllusEscrow() {
  return (
    <svg width="100%" viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="44" cy="64" r="24" fill="#f0f2e6"/>
      <circle cx="44" cy="54" r="12" fill="#cfd4ae" opacity="0.5"/>
      <path d="M24 84 Q24 73 44 73 Q64 73 64 84" stroke="#7a7f6a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <text x="44" y="104" textAnchor="middle" fill="#7a7f6a" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">Comprador</text>
      <path d="M74 64 L130 64" stroke="#cfd4ae" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
      <path d="M126 59 L134 64 L126 69" stroke="#cfd4ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="86" y="53" width="26" height="14" rx="7" fill="#cfd4ae"/>
      <text x="99" y="64" textAnchor="middle" fill="#1e2114" fontSize="8" fontWeight="900" fontFamily="Inter,sans-serif">$$</text>
      <rect x="134" y="42" width="62" height="52" rx="10" fill="white" stroke="#cfd4ae" strokeWidth="1.5"/>
      <path d="M153 60 v-5 a12 12 0 0 1 24 0 v5" stroke="#cfd4ae" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="149" y="60" width="32" height="20" rx="5" fill="#cfd4ae" opacity="0.6"/>
      <circle cx="165" cy="70" r="3" fill="#1e2114" opacity="0.35"/>
      <text x="165" y="108" textAnchor="middle" fill="#1e2114" fontSize="8" fontWeight="800" fontFamily="Inter,sans-serif">TRUEKI</text>
      <path d="M198 68 L244 68" stroke="#cfd4ae" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.4"/>
      <path d="M240 63 L248 68 L240 73" stroke="#cfd4ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
      <circle cx="270" cy="68" r="24" fill="#f0f2e6"/>
      <path d="M260 68 L266 74 L282 58" stroke="#7a7f6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="270" y="104" textAnchor="middle" fill="#7a7f6a" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">Verificado</text>
      <rect x="10" y="124" width="300" height="28" rx="8" fill="#f0f2e6"/>
      <text x="160" y="136" textAnchor="middle" fill="#1e2114" fontSize="9" fontWeight="800" fontFamily="Inter,sans-serif">Tu pago queda retenido hasta verificación</text>
      <text x="160" y="147" textAnchor="middle" fill="#7a7f6a" fontSize="8" fontFamily="Inter,sans-serif">Solo se libera tras entrega exitosa</text>
    </svg>
  );
}

function IllusVerify() {
  return (
    <svg width="100%" viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="110" width="300" height="3" rx="1.5" fill="#e4e7d4"/>
      <path d="M82 70 v-10 a18 18 0 0 1 36 0 v10" stroke="#1e2114" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"/>
      <rect x="78" y="70" width="44" height="40" rx="8" fill="#1e2114" opacity="0.65"/>
      <rect x="92" y="82" width="16" height="3" rx="1.5" fill="#cfd4ae" opacity="0.5"/>
      <rect x="95" y="90" width="10" height="3" rx="1.5" fill="#cfd4ae" opacity="0.3"/>
      <circle cx="188" cy="74" r="28" fill="white" stroke="#e4e7d4" strokeWidth="2"/>
      <circle cx="188" cy="74" r="20" fill="#f7f8f3" stroke="#cfd4ae" strokeWidth="1.5"/>
      <circle cx="188" cy="71" r="6.5" stroke="#cfd4ae" strokeWidth="2" fill="none"/>
      <path d="M192.5 75.5 L198 82" stroke="#cfd4ae" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="240" y="22" width="72" height="112" rx="10" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="248" y="34" width="56" height="2" rx="1" fill="#e4e7d4"/>
      <rect x="248" y="42" width="40" height="2" rx="1" fill="#e4e7d4"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <circle cx="252" cy={62+i*17} r="5" fill={i < 3 ? "#cfd4ae" : "#f0f2e6"}/>
          {i < 3 && <path d={`M249 ${62+i*17} L251 ${64+i*17} L256 ${59+i*17}`} stroke="#1e2114" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          <rect x="262" y={59+i*17} width={i < 3 ? 42 : 34} height="6" rx="3" fill="#f0f2e6"/>
        </g>
      ))}
    </svg>
  );
}

function IllusDeliver() {
  return (
    <svg width="100%" viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="38" cy="66" r="22" fill="#f0f2e6"/>
      <circle cx="38" cy="57" r="11" fill="#cfd4ae" opacity="0.4"/>
      <path d="M18 82 Q18 72 38 72 Q58 72 58 82" stroke="#7a7f6a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M60 72 Q88 54 108 68" stroke="#cfd4ae" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.5"/>
      <path d="M104 64 L110 70 L104 74" stroke="#cfd4ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
      <rect x="110" y="42" width="86" height="78" rx="10" fill="white" stroke="#cfd4ae" strokeWidth="2"/>
      <path d="M110 70 L196 70" stroke="#cfd4ae" strokeWidth="1" opacity="0.4"/>
      <path d="M153 42 L153 70" stroke="#cfd4ae" strokeWidth="1" opacity="0.4"/>
      <rect x="144" y="42" width="18" height="78" rx="0" fill="#cfd4ae" opacity="0.1"/>
      <circle cx="153" cy="108" r="18" fill="#cfd4ae" opacity="0.15" stroke="#cfd4ae" strokeWidth="1.5"/>
      <path d="M145 108 L151 114 L163 102" stroke="#cfd4ae" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {[[222,40,15],[244,68,-10],[266,42,22]].map(([x,y,r],i)=>(
        <rect key={i} x={x-4} y={y-4} width="8" height="8" rx="2" fill="#cfd4ae" opacity={0.2+i*0.1} transform={`rotate(${r} ${x} ${y})`}/>
      ))}
      <rect x="10" y="132" width="300" height="22" rx="8" fill="#f0f2e6"/>
      <text x="160" y="144" textAnchor="middle" fill="#1e2114" fontSize="9" fontWeight="800" fontFamily="Inter,sans-serif">Garantía 48h · Reembolso total si algo falla</text>
    </svg>
  );
}

// ── Marquee ──────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = ["Louis Vuitton","✦ Verificado","Gucci","Chanel","✦ Autenticado","Jordan","Balenciaga","✦ 100% Real","Prada","Hermès","✦ Garantizado","Nike","New Balance","✦ Chile"];

function Marquee() {
  const all = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden py-3.5 border-y border-border">
      <div className="flex gap-7" style={{ animation: "marquee 22s linear infinite", width: "max-content" }}>
        {all.map((b, i) => (
          <span key={i} className={`text-[11px] font-black whitespace-nowrap tracking-wide ${b.startsWith("✦") ? "text-foreground bg-primary px-3 py-0.5 rounded" : "text-muted-foreground"}`}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Paso con ilustración ──────────────────────────────────────────────────────

function Step({ num, tag, title, desc, illus, dark = false }: {
  num: string; tag: string; title: string; desc: string;
  illus: React.ReactNode; dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="px-5 pt-10 pb-4">
        <p className="text-[64px] font-black leading-none tracking-tighter mb-[-16px]" style={{ color: "#f0f2e6" }}>{num}</p>
        <div className="relative">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded mb-2" style={{ background: "#cfd4ae", color: "#1e2114" }}>{tag}</span>
          <h2 className="text-xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.03em" }}>{title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#7a7f6a" }}>{desc}</p>
        </div>
      </div>
      <div className={`mx-4 rounded-2xl border-2 p-5 ${dark ? "bg-muted/40 border-border" : "bg-muted/40 border-border"}`}>
        {illus}
      </div>
    </div>
  );
}

// ── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage() {
  const { user } = useAuth();
  const { listings, loading } = usePublishedListings({ limit: 8 });
  const categories = useCategories();
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const filteredListings = activeCat ? listings.filter(l => l.category_id === activeCat) : listings;

  return (
    <div className="app-shell pb-24 bg-white">
      <AppHeader showLogo />

      {/* ── HERO CON FOTO EDITORIAL ─────────────────────────────── */}
      <section className="relative w-full" style={{ minHeight: "85dvh" }}>
        {/* Foto de fondo — modelo editorial con bolso de lujo */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85&auto=format&fit=crop"
            alt="Modelo con moda premium"
            className="h-full w-full object-cover object-top"
          />
          {/* Overlay gradiente suave de abajo */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.92) 75%, rgba(255,255,255,1) 100%)" }} />
          {/* Overlay lateral izquierdo muy sutil */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
        </div>

        {/* Contenido sobre la foto */}
        <div className="relative flex flex-col justify-end h-full px-5 pb-8" style={{ minHeight: "85dvh" }}>
          {/* Badge arriba */}
          <div className="absolute top-4 left-5 flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(207,212,174,0.5)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#cfd4ae" }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#1e2114" }}>Verificado · Chile</span>
          </div>

          {/* Texto principal */}
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: "#7a7f6a", letterSpacing: "0.1em", textTransform: "uppercase" }}>Marketplace premium</p>
            <h1 className="font-black leading-[0.92] mb-3" style={{ fontSize: "clamp(38px,10vw,52px)", letterSpacing: "-0.05em", color: "#1e2114" }}>
              MODA<br /><span style={{ color: "#cfd4ae" }}>PREMIUM.</span><br />SIN RIESGOS.
            </h1>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "#7a7f6a" }}>
              Cada pieza que ves en Trueki ha pasado por autenticación física antes de llegar a tus manos.
            </p>
            <div className="flex gap-2">
              <Link to="/search" className="flex-1 rounded-full py-3.5 text-center text-sm font-black" style={{ background: "#1e2114", color: "white" }}>
                Explorar →
              </Link>
              <Link to="/sell" className="rounded-full border-2 px-5 py-3 text-sm font-black" style={{ borderColor: "#e4e7d4", color: "#1e2114", background: "white" }}>
                Vender
              </Link>
            </div>
          </div>
        </div>

        {/* Stats flotantes */}
        <div className="absolute bottom-0 right-4 flex flex-col gap-2 pb-8">
          {[
            { v: "94.2%", l: "Autenticidad" },
            { v: "100%",  l: "Reembolso" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl px-3 py-2 text-right" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid #e4e7d4" }}>
              <p className="text-base font-black" style={{ letterSpacing: "-0.04em", color: "#1e2114" }}>{s.v}</p>
              <p className="text-[10px] font-bold" style={{ color: "#7a7f6a" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BÚSQUEDA ────────────────────────────────────────────── */}
      <div className="px-4 pt-5">
        <Link to="/search" className="flex items-center gap-3 rounded-2xl border-2 border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <span>Buscar marca, artículo, talla...</span>
        </Link>
      </div>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <div className="mt-5">
        <Marquee />
      </div>

      {/* ── PASOS CON ILUSTRACIONES ─────────────────────────────── */}
      <Step num="01" tag="Descubrir" title="Encuentra tu pieza perfecta"
        desc="Miles de artículos premium verificados. Filtra por marca, talla, condición y precio."
        illus={<IllusBrowse />} />

      <Step num="02" tag="Comprar seguro" title="Tu pago, protegido desde el inicio"
        desc="El dinero queda en escrow hasta verificación. Nunca se libera antes."
        illus={<IllusEscrow />} />

      <Step num="03" tag="Autenticar" title="Expertos revisan cada detalle"
        desc="Nuestro equipo en Santiago verifica materiales, costuras, herrajes y seriales con evidencia fotográfica."
        illus={<IllusVerify />} />

      <Step num="04" tag="Recibir" title="Tuyo. Auténtico. Garantizado."
        desc="Si hay algo mal, reembolso del 100% en 48 horas. Sin preguntas, sin vueltas."
        illus={<IllusDeliver />} />

      {/* ── SECCIÓN GARANTÍAS ────────────────────────────────────── */}
      <section className="mt-8 mx-4 rounded-3xl p-6" style={{ background: "#f7f8f3", border: "2px solid #e4e7d4" }}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: "#7a7f6a" }}>Por qué Trueki</p>
        <div className="space-y-4">
          {[
            { icon: <ShieldCheck className="h-5 w-5" />, t: "Autenticación garantizada", d: "Cada artículo es revisado físicamente por expertos antes del envío." },
            { icon: <RotateCcw className="h-5 w-5" />, t: "100% reembolso", d: "Si es falso o no corresponde, te devolvemos todo al instante." },
            { icon: <CheckCircle2 className="h-5 w-5" />, t: "Vendedores verificados", d: "RUT validado, historial y valoraciones públicas." },
          ].map(({ icon, t, d }, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "#cfd4ae" }}>{icon}</div>
              <div>
                <p className="text-sm font-black" style={{ letterSpacing: "-0.02em" }}>{t}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#7a7f6a" }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────────────────── */}
      <section className="mt-6 px-5 py-12 text-center" style={{ background: "#cfd4ae" }}>
        <p className="font-black text-2xl leading-tight mb-2" style={{ letterSpacing: "-0.04em", color: "#1e2114" }}>
          "La moda de segunda mano merece la misma confianza que comprar en boutique."
        </p>
        <p className="text-sm mb-7" style={{ color: "rgba(30,33,20,0.6)" }}>— Trueki, Santiago 2025</p>
        <Link to="/search" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black" style={{ background: "#1e2114", color: "white" }}>
          Explorar Trueki <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* ── CATEGORÍAS ──────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="px-4 pt-6 flex gap-2 flex-wrap">
          <button onClick={() => setActiveCat(null)} className={`rounded-full border-2 px-4 py-2 text-sm font-black transition-all ${!activeCat ? "border-primary bg-primary" : "border-border bg-card"}`}>
            Todo
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-black transition-all ${activeCat === c.id ? "border-primary bg-primary" : "border-border bg-card"}`}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* ── FEED ────────────────────────────────────────────────── */}
      <section className="px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-black text-lg" style={{ letterSpacing: "-0.03em" }}>
            {activeCat ? categories.find(c => c.id === activeCat)?.name : "Recién publicado"}
          </h3>
          <Link to="/search" className="text-xs font-bold" style={{ color: "#7a7f6a" }}>Ver todo →</Link>
        </div>
        {loading ? <SkeletonList count={4} /> : (
          <div className="grid grid-cols-2 gap-3 listings-grid">
            {filteredListings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* ── CTA VENDER ──────────────────────────────────────────── */}
      {!user && (
        <section className="mt-8 mx-4 mb-4 rounded-3xl border-2 border-primary/30 bg-primary/10 p-6">
          <p className="font-black text-base mb-1" style={{ letterSpacing: "-0.02em" }}>¿Tienes artículos premium?</p>
          <p className="text-sm mb-4" style={{ color: "#7a7f6a" }}>Publica gratis. Nosotros verificamos y enviamos.</p>
          <Link to="/sell" className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-black" style={{ background: "#cfd4ae", color: "#1e2114" }}>
            Publicar artículo gratis <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="px-4 py-8 text-center border-t-2 border-border mt-6">
        <p className="font-black text-lg" style={{ letterSpacing: "-0.05em" }}>Trueki</p>
        <p className="text-xs mt-0.5 mb-4" style={{ color: "#7a7f6a" }}>Marketplace premium verificado · Santiago, Chile</p>
        <div className="flex justify-center gap-5 text-xs" style={{ color: "#7a7f6a" }}>
          <Link to="/legal/terms">Términos</Link>
          <Link to="/legal/privacy">Privacidad</Link>
          <Link to="/legal/authenticity">Autenticidad</Link>
        </div>
        <p className="mt-4 text-[10px]" style={{ color: "#7a7f6a" }}>© 2025 Trueki. Todos los derechos reservados.</p>
      </footer>

      <BottomTabs />
    </div>
  );
}
