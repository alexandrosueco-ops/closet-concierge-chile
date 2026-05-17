import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, ShieldCheck, RotateCcw, CheckCircle2, Menu, X } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonList } from "@/components/SkeletonCard";
import { TruekiLogo } from "@/components/TruekiLogo";
import { usePublishedListings, useCategories } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Trueki — Moda premium verificada en Chile" }] }),
  component: LandingPage,
});

// ── Nav horizontal ────────────────────────────────────────────────────────────

function TopNav() {
  const { user, initial } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur border-b border-border shadow-sm" : "bg-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          {/* Logo */}
          <Link to="/">
            <TruekiLogo size="sm" variant="full" />
          </Link>

          {/* Nav central — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: "/search", label: "Explorar" },
              { to: "/sell", label: "Vender" },
              { to: "/legal/authenticity", label: "Autenticidad" },
              { to: "/buyer/orders", label: "Mis compras" },
            ].map(({ to, label }) => (
              <Link key={to} to={to as "/"} className="px-4 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                {label}
              </Link>
            ))}
          </div>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-black text-sm text-primary-foreground">
                {initial}
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                  Entrar
                </Link>
                <Link to="/auth/signup" className="rounded-full bg-foreground px-4 py-2 text-sm font-black text-background transition-all hover:bg-foreground/90">
                  Registrarse gratis
                </Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button onClick={() => setMenuOpen(v => !v)} className="flex md:hidden h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16" onClick={() => setMenuOpen(false)}>
          <div className="flex flex-col gap-1 px-5 pt-4">
            {[
              { to: "/search", label: "Explorar" },
              { to: "/sell", label: "Vender" },
              { to: "/buyer/orders", label: "Mis compras" },
              { to: "/legal/authenticity", label: "Autenticidad" },
            ].map(({ to, label }) => (
              <Link key={to} to={to as "/"} className="block rounded-2xl px-4 py-3.5 text-base font-black hover:bg-muted transition-colors" style={{ letterSpacing: "-0.02em" }}>
                {label}
              </Link>
            ))}
            <div className="mt-4 border-t border-border pt-4 flex flex-col gap-2">
              {user ? (
                <Link to="/settings" className="rounded-full bg-primary py-3.5 text-center text-sm font-black">
                  Mi cuenta
                </Link>
              ) : (
                <>
                  <Link to="/auth/signup" className="rounded-full bg-foreground py-3.5 text-center text-sm font-black text-background">
                    Registrarse gratis
                  </Link>
                  <Link to="/auth/login" className="rounded-full border-2 border-border py-3 text-center text-sm font-bold text-muted-foreground">
                    Entrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────

const MARQUEE = ["Louis Vuitton","✦ Verificado","Gucci","Chanel","✦ Autenticado","Jordan","Balenciaga","✦ 100% Real","Prada","Hermès","✦ Garantizado","Nike","New Balance","✦ Chile"];

function Marquee() {
  const all = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden py-3.5 border-y border-border">
      <div className="flex gap-7" style={{ animation: "marquee 24s linear infinite", width: "max-content" }}>
        {all.map((b, i) => (
          <span key={i} className={`text-[11px] font-black whitespace-nowrap tracking-wide ${b.startsWith("✦") ? "text-primary-foreground bg-primary px-3 py-0.5 rounded" : "text-muted-foreground"}`}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Paso con ilustración ──────────────────────────────────────────────────────

function Step({ num, tag, title, desc, illus }: {
  num: string; tag: string; title: string; desc: string; illus: React.ReactNode;
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
      <div className="max-w-lg mx-auto px-5 pt-10 pb-4">
        <p className="font-black leading-none tracking-tighter mb-[-14px]" style={{ fontSize: 64, color: "#f0f2e6" }}>{num}</p>
        <div className="relative">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded mb-2 bg-primary text-primary-foreground">{tag}</span>
          <h2 className="text-xl font-black leading-tight mb-2" style={{ letterSpacing: "-0.03em" }}>{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <div className="rounded-2xl border-2 border-border bg-muted/30 p-5">{illus}</div>
      </div>
    </div>
  );
}

// ── SVG Ilustraciones ─────────────────────────────────────────────────────────

function IllusBrowse() {
  return (
    <svg width="100%" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="10" width="380" height="26" rx="13" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <circle cx="32" cy="23" r="6" stroke="#dadd48" strokeWidth="2" fill="none"/>
      <line x1="36.5" y1="27.5" x2="41" y2="32" stroke="#dadd48" strokeWidth="2" strokeLinecap="round"/>
      <rect x="48" y="17" width="110" height="12" rx="6" fill="#f0f2e6"/>
      <rect x="10" y="46" width="44" height="16" rx="8" fill="#dadd48"/>
      <rect x="60" y="46" width="56" height="16" rx="8" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="122" y="46" width="52" height="16" rx="8" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="180" y="46" width="60" height="16" rx="8" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      {/* Card 1 */}
      <rect x="10" y="72" width="178" height="100" rx="14" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="10" y="72" width="178" height="60" rx="14" fill="#f5f2ec"/>
      <rect x="10" y="110" width="178" height="22" rx="0" fill="#f5f2ec"/>
      <path d="M74 100 v-9 a24 24 0 0 1 48 0 v9" stroke="#1e2114" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
      <rect x="68" y="100" width="56" height="32" rx="8" fill="#1e2114" opacity="0.7"/>
      <rect x="86" y="112" width="20" height="3" rx="1.5" fill="#dadd48" opacity="0.5"/>
      <rect x="18" y="144" width="64" height="12" rx="6" fill="#dadd48"/>
      <rect x="18" y="160" width="80" height="7" rx="3.5" fill="#f0f2e6"/>
      {/* Card 2 */}
      <rect x="196" y="72" width="204" height="100" rx="14" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="196" y="72" width="204" height="60" rx="14" fill="#eef0f5"/>
      <rect x="196" y="110" width="204" height="22" rx="0" fill="#eef0f5"/>
      <path d="M222 116 Q242 100 282 108 Q300 112 298 124 L222 124 Z" fill="#1e2114" opacity="0.65"/>
      <path d="M222 124 L298 124 L296 129 L224 129 Z" fill="#dadd48"/>
      <rect x="204" y="144" width="64" height="12" rx="6" fill="#dadd48"/>
      <rect x="204" y="160" width="80" height="7" rx="3.5" fill="#f0f2e6"/>
    </svg>
  );
}

function IllusEscrow() {
  return (
    <svg width="100%" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="52" cy="58" r="28" fill="#f0f2e6"/>
      <circle cx="52" cy="46" r="14" fill="#dadd48" opacity="0.4"/>
      <path d="M28 76 Q28 63 52 63 Q76 63 76 76" stroke="#7a7f6a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <text x="52" y="98" textAnchor="middle" fill="#7a7f6a" fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">Comprador</text>
      <path d="M88 58 L154 58" stroke="#dadd48" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
      <path d="M150 52 L158 58 L150 64" stroke="#dadd48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="102" y="45" width="36" height="16" rx="8" fill="#dadd48"/>
      <text x="120" y="57" textAnchor="middle" fill="#1e2114" fontSize="9" fontWeight="900" fontFamily="Inter,sans-serif">Pago $$</text>
      <rect x="160" y="34" width="80" height="60" rx="12" fill="white" stroke="#dadd48" strokeWidth="2"/>
      <path d="M184 54 v-7 a16 16 0 0 1 32 0 v7" stroke="#dadd48" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="178" y="54" width="44" height="24" rx="6" fill="#dadd48" opacity="0.5"/>
      <circle cx="200" cy="66" r="4" fill="#1e2114" opacity="0.3"/>
      <text x="200" y="112" textAnchor="middle" fill="#1e2114" fontSize="10" fontWeight="800" fontFamily="Inter,sans-serif">TRUEKI</text>
      <text x="200" y="126" textAnchor="middle" fill="#7a7f6a" fontSize="9" fontFamily="Inter,sans-serif">Escrow seguro</text>
      <path d="M242 64 L298 64" stroke="#dadd48" strokeWidth="1.5" strokeDasharray="5 3" fill="none" opacity="0.4"/>
      <path d="M294 58 L302 64 L294 70" stroke="#dadd48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
      <circle cx="330" cy="58" r="28" fill="#f0f2e6"/>
      <path d="M318 58 L326 66 L344 50" stroke="#7a7f6a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="330" y="98" textAnchor="middle" fill="#7a7f6a" fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">Verificado</text>
    </svg>
  );
}

function IllusVerify() {
  return (
    <svg width="100%" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="10" y="120" width="380" height="3" rx="1.5" fill="#e4e7d4"/>
      <path d="M100 86 v-12 a22 22 0 0 1 44 0 v12" stroke="#1e2114" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"/>
      <rect x="96" y="86" width="52" height="34" rx="8" fill="#1e2114" opacity="0.65"/>
      <rect x="112" y="98" width="20" height="3" rx="1.5" fill="#dadd48" opacity="0.5"/>
      <rect x="115" y="106" width="14" height="3" rx="1.5" fill="#dadd48" opacity="0.3"/>
      <circle cx="230" cy="80" r="36" fill="white" stroke="#e4e7d4" strokeWidth="2"/>
      <circle cx="230" cy="80" r="26" fill="#f7f8f3" stroke="#dadd48" strokeWidth="1.5"/>
      <circle cx="230" cy="76" r="8" stroke="#dadd48" strokeWidth="2" fill="none"/>
      <path d="M236 82 L244 92" stroke="#dadd48" strokeWidth="3" strokeLinecap="round"/>
      <rect x="300" y="20" width="90" height="120" rx="12" fill="white" stroke="#e4e7d4" strokeWidth="1.5"/>
      <rect x="310" y="34" width="70" height="2" rx="1" fill="#e4e7d4"/>
      <rect x="310" y="42" width="50" height="2" rx="1" fill="#e4e7d4"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <circle cx="316" cy={60+i*18} r="6" fill={i < 3 ? "#dadd48" : "#f0f2e6"}/>
          {i < 3 && <path d={`M313 ${60+i*18} L315 ${62+i*18} L320 ${57+i*18}`} stroke="#1e2114" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          <rect x="328" y={57+i*18} width={i < 3 ? 54 : 44} height="6" rx="3" fill="#f0f2e6"/>
        </g>
      ))}
    </svg>
  );
}

function IllusDeliver() {
  return (
    <svg width="100%" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="46" cy="58" r="26" fill="#f0f2e6"/>
      <circle cx="46" cy="48" r="13" fill="#dadd48" opacity="0.4"/>
      <path d="M24 74 Q24 64 46 64 Q68 64 68 74" stroke="#7a7f6a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M72 62 Q104 42 128 58" stroke="#dadd48" strokeWidth="1.5" strokeDasharray="5 3" fill="none" opacity="0.5"/>
      <path d="M124 54 L130 62 L122 64" stroke="#dadd48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
      <rect x="130" y="30" width="110" height="90" rx="12" fill="white" stroke="#dadd48" strokeWidth="2"/>
      <path d="M130 62 L240 62" stroke="#dadd48" strokeWidth="1" opacity="0.4"/>
      <path d="M185 30 L185 62" stroke="#dadd48" strokeWidth="1" opacity="0.4"/>
      <rect x="176" y="30" width="18" height="90" rx="0" fill="#dadd48" opacity="0.1"/>
      <circle cx="185" cy="100" r="20" fill="#dadd48" opacity="0.15" stroke="#dadd48" strokeWidth="1.5"/>
      <path d="M176 100 L183 107 L196 93" stroke="#dadd48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {[[268,36,15],[292,62,-10],[316,38,22],[278,90,5]].map(([x,y,r],i)=>(
        <rect key={i} x={x-4} y={y-4} width="8" height="8" rx="2" fill="#dadd48" opacity={0.15+i*0.1} transform={`rotate(${r} ${x} ${y})`}/>
      ))}
      <rect x="264" y="100" width="120" height="26" rx="8" fill="#f0f2e6"/>
      <text x="324" y="114" textAnchor="middle" fill="#1e2114" fontSize="10" fontWeight="800" fontFamily="Inter,sans-serif">48h garantía</text>
      <text x="324" y="120" textAnchor="middle" fill="#7a7f6a" fontSize="8" fontFamily="Inter,sans-serif">Reembolso total si falla</text>
    </svg>
  );
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────

function LandingPage() {
  const { user } = useAuth();
  const { listings, loading } = usePublishedListings({ limit: 8 });
  const categories = useCategories();
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const filteredListings = activeCat ? listings.filter(l => l.category_id === activeCat) : listings;

  return (
    <div className="min-h-dvh w-full bg-white">
      {/* NAV HORIZONTAL FIJO */}
      <TopNav />

      {/* ── HERO SPLIT: TEXTO IZQUIERDA · FOTO DERECHA ──────────── */}
      <section className="w-full" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <div className="flex flex-col md:flex-row flex-1" style={{ minHeight: "100dvh" }}>

          {/* ── LADO IZQUIERDO — contenido ─────────────────────── */}
          <div className="flex flex-col justify-center px-6 py-24 md:py-0 md:px-14 lg:px-20"
            style={{ flex: "0 0 50%", background: "#fff", zIndex: 1 }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 self-start"
              style={{ background: "#f7f8a0", border: "1px solid #dadd48" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#1e2114" }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#1e2114" }}>Marketplace verificado · Chile</span>
            </div>

            {/* Título */}
            <h1 className="font-black leading-[0.88] mb-5"
              style={{ fontSize: "clamp(42px,6vw,80px)", letterSpacing: "-0.05em", color: "#1e2114" }}>
              MODA<br /><span style={{ color: "#dadd48" }}>PREMIUM.</span><br />SIN RIESGOS.
            </h1>

            <p className="mb-8 leading-relaxed"
              style={{ fontSize: "clamp(14px,1.2vw,17px)", color: "rgba(30,33,20,0.6)", maxWidth: 380 }}>
              Compra y vende ropa, bolsos y zapatillas de marca con autenticación física garantizada antes de cada entrega.
            </p>

            {/* CTAs */}
            <div className="flex gap-2 flex-wrap mb-10">
              <Link to="/search"
                className="rounded-full py-3.5 px-7 text-sm font-black transition-all active:scale-95"
                style={{ background: "#1e2114", color: "white" }}>
                Explorar →
              </Link>
              <Link to="/sell"
                className="rounded-full border-2 py-3.5 px-6 text-sm font-black transition-all hover:bg-muted"
                style={{ borderColor: "#e4e7d4", color: "#1e2114" }}>
                Vender ahora
              </Link>
              {!user && (
                <Link to="/auth/signup"
                  className="rounded-full py-3.5 px-6 text-sm font-black transition-all"
                  style={{ background: "#dadd48", color: "#1e2114" }}>
                  Crear cuenta gratis
                </Link>
              )}
            </div>

            {/* Stats horizontales */}
            <div className="flex gap-5 flex-wrap">
              {[
                { v: "Autenticidad", l: "garantizada" },
                { v: "100%",  l: "Reembolso si es falso" },
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: "2px solid #dadd48", paddingLeft: 10 }}>
                  <p className="text-sm font-black" style={{ letterSpacing: "-0.03em", color: "#1e2114" }}>{s.v}</p>
                  <p className="text-[10px] font-semibold" style={{ color: "#7a7f6a" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── LADO DERECHO — foto ────────────────────────────── */}
          <div className="relative" style={{ flex: "0 0 50%", minHeight: "60dvh" }}>
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=90&auto=format&fit=crop"
              alt="Modelo con moda premium verificada"
              className="absolute inset-0 h-full w-full"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
            {/* Fade sutil en el borde izquierdo para unión suave */}
            <div className="absolute inset-y-0 left-0 w-16"
              style={{ background: "linear-gradient(to right, rgba(255,255,255,0.4), transparent)" }} />
          </div>

        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <Marquee />

      {/* ── TRUST RÁPIDO ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck className="h-6 w-6" />, t: "Autenticación y fotos profesionales", d: "Enviamos tu artículo, lo verificamos y lo fotografiamos nosotros. La publicación queda perfecta sin que tú hagas nada más." },
            { icon: <CheckCircle2 className="h-6 w-6" />, t: "Pago retenido hasta confirmación", d: "El dinero del comprador queda con nosotros. Se libera al vendedor solo cuando el comprador acepta — o automáticamente a las 2 horas de la entrega." },
            { icon: <RotateCcw className="h-6 w-6" />, t: "Protección para ambas partes", d: "2 horas para reportar problemas tras el retiro. Si todo está bien (o el tiempo vence), el pago se libera automáticamente al vendedor." },
          ].map(({ icon, t, d }, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl border-2 border-border p-6 bg-card hover:border-primary/40 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">{icon}</div>
              <p className="font-black text-base" style={{ letterSpacing: "-0.02em" }}>{t}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BÚSQUEDA ────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-5 pb-6">
        <Link to="/search" className="flex items-center gap-3 rounded-2xl border-2 border-border bg-muted/60 px-5 py-4 text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Search className="h-4 w-4 shrink-0" />
          <span>Buscar marca, artículo, talla...</span>
        </Link>
      </div>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────── */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-5 md:px-8 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Proceso</p>
          <h2 className="text-2xl font-black" style={{ letterSpacing: "-0.04em" }}>¿Cómo funciona Trueki?</h2>
        </div>

        <Step num="01" tag="Vendedor — Enviar solicitud" title="Envías tu artículo a Trueki, gratis"
          desc="Rellenas un formulario con información del artículo y subes algunas fotos de referencia. Luego envías el artículo a nuestro centro de Santiago — el envío corre por tu cuenta, sin costo de registro." illus={<IllusBrowse />} />
        <Step num="02" tag="Trueki — Verificar y publicar" title="Lo verificamos, fotografiamos y publicamos"
          desc="Nuestro equipo autentica el artículo, toma fotos profesionales y crea la publicación en la plataforma. Tú no necesitas hacer nada más — nosotros gestionamos todo." illus={<IllusVerify />} />
        <Step num="03" tag="Comprador — Pagar con garantía" title="El comprador paga y el dinero queda en hold"
          desc="Cuando alguien compra, el pago queda retenido con nosotros. El comprador paga el envío y Trueki despacha el artículo directamente desde nuestro centro." illus={<IllusEscrow />} />
        <Step num="04" tag="Entrega — Confirmación automática" title="2 horas para aceptar, luego pago automático"
          desc="El comprador tiene 2 horas desde el retiro o entrega para reportar algún problema. Si no hay reclamos, se acepta automáticamente: el dinero se libera al vendedor y se descuenta la comisión de garantía de Trueki." illus={<IllusDeliver />} />
      </section>

      {/* ── MANIFESTO ────────────────────────────────────────────── */}
      <section className="bg-primary py-16 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-black text-2xl md:text-3xl leading-tight mb-3" style={{ letterSpacing: "-0.04em", color: "#1e2114" }}>
            "Enviamos tu artículo. Lo verificamos. Lo publicamos. Cuando se vende, tú cobras."
          </p>
          <p className="text-sm mb-8" style={{ color: "rgba(30,33,20,0.6)" }}>— Trueki, Santiago 2025</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/search" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black" style={{ background: "#1e2114", color: "white" }}>
              Explorar Trueki <ArrowRight className="h-4 w-4" />
            </Link>
            {!user && (
              <Link to="/auth/signup" className="inline-flex items-center gap-2 rounded-full border-2 border-foreground/30 px-7 py-3.5 text-sm font-black" style={{ color: "#1e2114" }}>
                Crear cuenta gratis
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-14">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Catálogo</p>
            <h2 className="text-xl font-black" style={{ letterSpacing: "-0.03em" }}>Recién publicado</h2>
          </div>
          <Link to="/search" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Ver todo →</Link>
        </div>

        {/* Filtros categoría */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5">
            <button onClick={() => setActiveCat(null)} className={`rounded-full border-2 px-4 py-2 text-sm font-black transition-all ${!activeCat ? "border-primary bg-primary" : "border-border bg-card hover:border-primary/30"}`}>Todo</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-black transition-all ${activeCat === c.id ? "border-primary bg-primary" : "border-border bg-card hover:border-primary/30"}`}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? <SkeletonList count={4} /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredListings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/search" className="inline-flex items-center gap-2 rounded-full border-2 border-border px-7 py-3.5 text-sm font-black hover:bg-muted transition-colors">
            Ver todos los artículos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── CTA VENDER ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-14">
        <div className="rounded-3xl border-2 border-primary/30 bg-primary/10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-black text-xl mb-1" style={{ letterSpacing: "-0.03em" }}>¿Tienes artículos premium?</p>
            <p className="text-sm text-muted-foreground max-w-sm">Publica gratis en minutos. Nosotros verificamos, empacamos y enviamos al comprador por ti.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link to="/sell" className="rounded-full bg-primary px-6 py-3 text-sm font-black whitespace-nowrap">
              Publicar artículo
            </Link>
            {!user && (
              <Link to="/auth/signup" className="rounded-full border-2 border-border bg-white px-6 py-3 text-sm font-black whitespace-nowrap">
                Registrarse gratis
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t-2 border-border px-5 md:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-black text-xl mb-0.5" style={{ letterSpacing: "-0.05em" }}>Trueki</p>
              <p className="text-xs text-muted-foreground">Marketplace premium verificado · Santiago, Chile</p>
            </div>
            <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
              <Link to="/legal/terms" className="hover:text-foreground transition-colors">Términos</Link>
              <Link to="/legal/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/legal/authenticity" className="hover:text-foreground transition-colors">Autenticidad</Link>
              <Link to="/legal/refunds" className="hover:text-foreground transition-colors">Reembolsos</Link>
            </div>
          </div>
          <p className="mt-6 text-[11px] text-muted-foreground">© 2025 Trueki. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
