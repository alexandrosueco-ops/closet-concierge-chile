import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

const sizes = {
  sm: { box: 24, font: 10, textSize: "text-sm", gap: "gap-1.5" },
  md: { box: 32, font: 13, textSize: "text-base", gap: "gap-2" },
  lg: { box: 44, font: 18, textSize: "text-xl", gap: "gap-2.5" },
};

export function TruekiLogo({ size = "md", variant = "full", className }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      {/* Ícono — T estilizada con forma de verificación */}
      <svg
        width={s.box}
        height={s.box}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Fondo sage redondeado */}
        <rect width="40" height="40" rx="10" fill="#cfd4ae" />
        {/* T + checkmark integrado */}
        <path
          d="M10 13h20M20 13v14M17 23l3 3 6-6"
          stroke="#1e2114"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={cn("font-black tracking-tight text-foreground", s.textSize)}
            style={{ letterSpacing: "-0.04em", fontFamily: "Inter, sans-serif" }}
          >
            Trueki
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground tracking-wide uppercase" style={{ letterSpacing: "0.08em" }}>
            Verificado · Chile
          </span>
        </div>
      )}
    </div>
  );
}

/** Solo el ícono cuadrado para favicon / avatar */
export function TruekiIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#cfd4ae" />
      <path d="M10 13h20M20 13v14M17 23l3 3 6-6" stroke="#1e2114" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
