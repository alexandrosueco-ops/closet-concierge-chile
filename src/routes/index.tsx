import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight } from "lucide-react";
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

// ── Ilustraciones SVG inline ─────────────────────────────────────────────────

function IllusBrowse() {
  return (
    <svg width="100%" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="12" width="300" height="28" rx="14" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <circle cx="42" cy="26" r="6" stroke="#cfd4ae" strokeWidth="2" fill="none"/>
      <line x1="46" y1="30" x2="50" y2="34" stroke="#cfd4ae" strokeWidth="2" strokeLinecap="round"/>
      <rect x="56" y="20" width="100" height="12" rx="6" fill="#f0f2e6"/>
      <rect x="20" y="50" width="46" height="18" rx="9" fill="#cfd4ae"/>
      <rect x="72" y="50" width="56" height="18" rx="9" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="134" y="50" width="52" height="18" rx="9" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      {/* Card 1 */}
      <rect x="20" y="78" width="148" height="110" rx="16" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="20" y="78" width="148" height="64" rx="16" fill="#f3f0e8"/>
      <rect x="20" y="120" width="148" height="22" rx="0" fill="#f3f0e8"/>
      <path d="M76 106 v-10 a8 8 0 0 1 16 0 v10" stroke="#1e2114" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <rect x="70" y="106" width="28" height="18" rx="4" fill="#1e2114" opacity="0.8"/>
      <rect x="28" y="150" width="64" height="14" rx="7" fill="#cfd4ae"/>
      <rect x="28" y="170" width="80" height="8" rx="4" fill="#f0f2e6"/>
      {/* Card 2 */}
      <rect x="178" y="78" width="142" height="110" rx="16" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="178" y="78" width="142" height="64" rx="16" fill="#eef0f5"/>
      <rect x="178" y="120" width="142" height="22" rx="0" fill="#eef0f5"/>
      <path d="M208 126 Q222 110 252 116 Q266 120 262 130 L208 130 Z" fill="#1e2114" opacity="0.7"/>
      <path d="M208 130 L262 130 L260 134 L210 134 Z" fill="#cfd4ae"/>
      <rect x="186" y="150" width="64" height="14" rx="7" fill="#cfd4ae"/>
      <rect x="186" y="170" width="80" height="8" rx="4" fill="#f0f2e6"/>
    </svg>
  );
}

function IllusEscrow() {
  return (
    <svg width="100%" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Comprador */}
      <circle cx="50" cy="70" r="26" fill="#cfd4ae" opacity="0.12"/>
      <circle cx="50" cy="59" r="13" fill="#cfd4ae" opacity="0.35"/>
      <path d="M27 92 Q27 79 50 79 Q73 79 73 92" stroke="#cfd4ae" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      <text x="50" y="110" textAnchor="middle" fill="#cfd4ae" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">Comprador</text>
      {/* Flecha $$ */}
      <path d="M82 70 L140 70" stroke="#cfd4ae" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
      <path d="M136 65 L144 70 L136 75" stroke="#cfd4ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="94" y="57" width="28" height="16" rx="8" fill="#cfd4ae"/>
      <text x="108" y="69" textAnchor="middle" fill="#1e2114" fontSize="8" fontWeight="900" fontFamily="Inter,sans-serif">$$</text>
      {/* Vault */}
      <rect x="148" y="45" width="64" height="56" rx="12" fill="#cfd4ae" opacity="0.12" stroke="#cfd4ae" strokeWidth="1.5"/>
      <rect x="156" y="53" width="48" height="38" rx="8" fill="#cfd4ae" opacity="0.2"/>
      <path d="M172 66 v-6 a8 8 0 0 1 16 0 v6" stroke="#cfd4ae" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="168" y="66" width="24" height="16" rx="4" fill="#cfd4ae" opacity="0.7"/>
      <circle cx="180" cy="74" r="3" fill="#1e2114" opacity="0.4"/>
      <text x="180" y="118" textAnchor="middle" fill="#cfd4ae" fontSize="9" fontWeight="800" fontFamily="Inter,sans-serif">TRUEKI</text>
      {/* Flecha a verificación */}
      <path d="M214 70 L262 70" stroke="#cfd4ae" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.4"/>
      <path d="M258 65 L266 70 L258 75" stroke="#cfd4ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
      {/* Verificación */}
      <rect x="270" y="47" width="54" height="50" rx="12" fill="white" opacity="0.05" stroke="#cfd4ae" strokeWidth="1" strokeDasharray="4 3"/>
      <text x="297" y="70" textAnchor="middle" fill="#cfd4ae" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">Verif.</text>
      <text x="297" y="84" textAnchor="middle" fill="#cfd4ae" fontSize="9" fontWeight="700" opacity="0.5" fontFamily="Inter,sans-serif">física</text>
      {/* Banner */}
      <rect x="20" y="142" width="300" height="36" rx="10" fill="#cfd4ae" opacity="0.08" stroke="#cfd4ae" strokeWidth="1"/>
      <text x="170" y="157" textAnchor="middle" fill="#cfd4ae" fontSize="10" fontWeight="800" fontFamily="Inter,sans-serif">Tu pago está seguro en Trueki</text>
      <text x="170" y="170" textAnchor="middle" fill="#cfd4ae" fontSize="9" opacity="0.5" fontFamily="Inter,sans-serif">Liberado solo tras verificación exitosa</text>
    </svg>
  );
}

function IllusVerify() {
  return (
    <svg width="100%" viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="130" width="300" height="4" rx="2" fill="#e4e7d4"/>
      {/* Bolsa */}
      <path d="M90 80 v-12 a20 20 0 0 1 40 0 v12" stroke="#1e2114" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.45"/>
      <rect x="86" y="80" width="48" height="50" rx="10" fill="#1e2114" opacity="0.7"/>
      <rect x="102" y="96" width="16" height="3" rx="1.5" fill="#cfd4ae" opacity="0.5"/>
      <rect x="105" y="104" width="10" height="3" rx="1.5" fill="#cfd4ae" opacity="0.35"/>
      {/* Lupa */}
      <circle cx="200" cy="82" r="30" fill="white" stroke="#e4e7d4" strokeWidth="2"/>
      <circle cx="200" cy="82" r="22" fill="#f7f8f3" stroke="#cfd4ae" strokeWidth="1.5"/>
      <circle cx="200" cy="79" r="7" stroke="#cfd4ae" strokeWidth="2" fill="none"/>
      <path d="M205 84 L212 91" stroke="#cfd4ae" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Checklist */}
      <rect x="250" y="30" width="76" height="118" rx="12" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="258" y="44" width="60" height="2" rx="1" fill="#e4e7d4"/>
      <rect x="258" y="52" width="44" height="2" rx="1" fill="#e4e7d4"/>
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <circle cx="264" cy={74 + i * 18} r="6" fill={i < 3 ? "#cfd4ae" : "#e4e7d4"}/>
          {i < 3 && <path d={`M261 ${74+i*18} L263 ${76+i*18} L268 ${71+i*18}`} stroke="#1e2114" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          <rect x="274" y={71 + i * 18} width={i < 3 ? 44 : 36} height="6" rx="3" fill="#f0f2e6"/>
        </g>
      ))}
    </svg>
  );
}

function IllusDeliver() {
  return (
    <svg width="100%" viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Caja */}
      <rect x="110" y="50" width="90" height="82" rx="12" fill="#cfd4ae" opacity="0.18" stroke="#cfd4ae" strokeWidth="2"/>
      <path d="M110 82 L200 82" stroke="#cfd4ae" strokeWidth="1" opacity="0.5"/>
      <path d="M155 50 L155 82" stroke="#cfd4ae" strokeWidth="1" opacity="0.5"/>
      <rect x="145" y="50" width="20" height="82" rx="0" fill="#cfd4ae" opacity="0.12"/>
      <rect x="110" y="89" width="90" height="3" rx="1.5" fill="#cfd4ae" opacity="0.2"/>
      {/* Sello */}
      <circle cx="155" cy="118" r="20" fill="#cfd4ae" opacity="0.18" stroke="#cfd4ae" strokeWidth="1.5"/>
      <path d="M146 118 L152 124 L165 111" stroke="#cfd4ae" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Persona */}
      <circle cx="44" cy="74" r="14" fill="#cfd4ae" opacity="0.3"/>
      <circle cx="44" cy="66" r="8" fill="#cfd4ae" opacity="0.5"/>
      <path d="M30 90 Q30 81 44 81 Q58 81 58 90" stroke="#cfd4ae" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Flecha */}
      <path d="M62 84 Q90 66 108 78" stroke="#cfd4ae" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.4"/>
      <path d="M104 74 L110 82 L102 84" stroke="#cfd4ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
      {/* Confeti */}
      {[[220,44,15],[244,72,-10],[268,48,25],[230,100,5]].map(([cx,cy,r],i) => (
        <rect key={i} x={cx-4} y={cy-4} width="8" height="8" rx="2" fill="#cfd4ae" opacity={0.2+i*0.1} transform={`rotate(${r} ${cx} ${cy})`}/>
      ))}
      <circle cx="290" cy="80" r="4" fill="#cfd4ae" opacity="0.25"/>
      {/* Banner */}
      <rect x="20" y="148" width="300" height="24" rx="8" fill="#cfd4ae" opacity="0.12" stroke="#cfd4ae" strokeWidth="1"/>
      <text x="170" y="165" textAnchor="middle" fill="#1e2114" fontSize="10" fontWeight="800" fontFamily="Inter,sans-serif">48h garantía · Reembolso total si algo falla</text>
    </svg>
  );
}

// ── Marquee ──────────────────────────────────────────────────────────────────

const BRANDS_MARQUEE = ["Louis Vuitton","✦ Verificado","Gucci","Chanel","✦ Autenticado","Jordan","Balenciaga","✦ 100% Real","Prada","Hermès","✦ Garantizado","Nike"];

function Marquee() {
  const doubled = [...BRANDS_MARQUEE, ...BRANDS_MARQUEE];
  return (
    <div className="overflow-hidden py-4 border-y border-border">
      <div className="flex gap-8 animate-[marquee_20s_linear_infinite] w-max">
        {doubled.map((b, i) => (
          <span key={i} className={`text-xs font-black whitespace-nowrap ${b.startsWith("✦") ? "text-foreground bg-primary px-3 py-0.5 rounded" : "text-muted-foreground"}`}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Paso editorial ───────────────────────────────────────────────────────────

function Step({ num, tag, title, desc, illus, dark = false }: {
  num: string; tag: string; title: string; desc: string;
  illus: React.ReactNode; dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="px-5 pt-10 pb-5">
        <p className="text-[72px] font-black leading-none tracking-tighter text-muted/60 mb-[-20px]">{num}</p>
        <div className="relative">
          <span className="inline-block bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-2">{tag}</span>
          <h2 className="text-xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.03em" }}>{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
      <div className={`mx-4 rounded-2xl overflow-hidden border-2 ${dark ? "bg-foreground border-foreground/20" : "bg-muted/40 border-border"}`}>
        <div className="p-5">{illus}</div>
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
    <div className="app-shell pb-24">
      <AppHeader showLogo />

      {/* ── HERO EDITORIAL ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-foreground px-5 pt-10 pb-12">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary opacity-10" />
        <div className="absolute -bottom-8 -left-6 h-28 w-28 rounded-full bg-primary opacity-8" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-3 py-1 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">verificado · chile</span>
          </div>
          <h1 className="text-background font-black text-[44px] leading-[0.95] mb-4" style={{ letterSpacing: "-0.05em" }}>
            MODA<br /><span className="text-primary">PREMIUM.</span><br />SIN RIESGOS.
          </h1>
          <p className="text-sm text-background/50 leading-relaxed mb-7 max-w-xs">
            Cada pieza que ves en Trueki ha pasado por autenticación física antes de llegar a tus manos.
          </p>
          <div className="flex gap-2">
            <Link to="/search" className="flex-1 rounded-full bg-primary py-3 text-center text-sm font-black text-primary-foreground">
              Explorar →
            </Link>
            <Link to="/sell" className="rounded-full border-2 border-background/20 px-5 py-3 text-sm font-black text-background">
              Vender
            </Link>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <Marquee />

      {/* ── PASO 1 ──────────────────────────────────────────────── */}
      <Step num="01" tag="Descubrir" title="Encuentra tu pieza perfecta"
        desc="Miles de artículos premium verificados. Filtra por marca, talla, condición y precio."
        illus={<IllusBrowse />} />

      {/* ── PASO 2 ──────────────────────────────────────────────── */}
      <Step num="02" tag="Comprar" title="Tu pago, protegido desde el inicio"
        desc="El dinero queda retenido en escrow hasta que el artículo pasa verificación. Nunca se libera antes."
        illus={<IllusEscrow />} dark />

      {/* ── PASO 3 ──────────────────────────────────────────────── */}
      <Step num="03" tag="Autenticar" title="Expertos revisan cada detalle"
        desc="Nuestro equipo en Santiago verifica materiales, costuras, herrajes, seriales y fecha codes con evidencia fotográfica."
        illus={<IllusVerify />} />

      {/* ── PASO 4 ──────────────────────────────────────────────── */}
      <Step num="04" tag="Recibir" title="Tuyo. Auténtico. Garantizado."
        desc="El artículo llega verificado con sello Trueki. Si hay algo mal, reembolso total en 48 horas. Sin preguntas."
        illus={<IllusDeliver />} dark />

      {/* ── MANIFESTO ───────────────────────────────────────────── */}
      <section className="bg-primary px-5 py-14 text-center">
        <p className="font-black text-2xl leading-tight text-foreground mb-2" style={{ letterSpacing: "-0.04em" }}>
          "La moda de segunda mano merece la misma confianza que comprar en boutique."
        </p>
        <p className="text-sm text-foreground/60 mb-8">— Trueki, Santiago 2025</p>
        <Link to="/search" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-black text-background">
          Explorar Trueki <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* ── BÚSQUEDA ────────────────────────────────────────────── */}
      <div className="px-4 pt-8">
        <Link to="/search" className="flex items-center gap-3 rounded-2xl border-2 border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <span>Buscar marca, artículo, talla...</span>
        </Link>
      </div>

      {/* ── CATEGORÍAS ──────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="px-4 pt-4 flex gap-2 flex-wrap">
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
          <Link to="/search" className="text-xs font-bold text-muted-foreground">Ver todo →</Link>
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
          <p className="text-sm text-muted-foreground mb-4">Publica gratis. Nosotros verificamos y enviamos.</p>
          <Link to="/sell" className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-black">
            Publicar artículo gratis <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="px-4 py-8 text-center border-t-2 border-border mt-6">
        <p className="font-black text-lg" style={{ letterSpacing: "-0.05em" }}>Trueki</p>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">Marketplace premium verificado · Santiago, Chile</p>
        <div className="flex justify-center gap-5 text-xs text-muted-foreground">
          <Link to="/legal/terms">Términos</Link>
          <Link to="/legal/privacy">Privacidad</Link>
          <Link to="/legal/authenticity">Autenticidad</Link>
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground">© 2025 Trueki. Todos los derechos reservados.</p>
      </footer>

      <BottomTabs />
    </div>
  );
}
