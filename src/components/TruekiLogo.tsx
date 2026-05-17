import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

const sizes = {
  sm: { box: 26, textSize: "text-sm",  gap: "gap-2" },
  md: { box: 34, textSize: "text-base", gap: "gap-2.5" },
  lg: { box: 48, textSize: "text-xl",  gap: "gap-3" },
};

/* Bolsa de lujo con check — opción 3 */
function BagIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="#dadd48" />
      {/* Cuerpo de la bolsa */}
      <path d="M18 27h28l-4 23H22L18 27z" fill="white" />
      {/* Asas */}
      <path
        d="M24 27v-5c0-4.4 3.6-8 8-8s8 3.6 8 8v5"
        stroke="#1e2114"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Checkmark de verificación */}
      <path
        d="M26 39l4 4 8-8"
        stroke="#1e2114"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TruekiLogo({ size = "md", variant = "full", className }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <BagIcon size={s.box} />
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={cn("font-black text-foreground", s.textSize)}
            style={{ letterSpacing: "-0.05em", fontFamily: "Inter, sans-serif" }}
          >
            Trueki
          </span>
          <span
            className="text-[9px] font-bold text-muted-foreground uppercase"
            style={{ letterSpacing: "0.08em" }}
          >
            Verificado · Chile
          </span>
        </div>
      )}
    </div>
  );
}

export function TruekiIcon({ size = 32 }: { size?: number }) {
  return <BagIcon size={size} />;
}
