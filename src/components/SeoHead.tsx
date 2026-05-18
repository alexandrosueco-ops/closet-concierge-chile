/**
 * SeoHead — Meta tags dinámicos para cada página
 * Inyecta en <head> via TanStack Router head()
 */

export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  noindex?: boolean;
  keywords?: string[];
}

const BASE_URL = "https://closet-concierge-chile.vercel.app";
const DEFAULT_OG = `${BASE_URL}/og-image.jpg`;

export function buildSeoMeta(props: SeoProps) {
  const {
    title,
    description,
    canonical,
    ogImage = DEFAULT_OG,
    ogType = "website",
    noindex = false,
    keywords = [],
  } = props;

  const fullTitle = title.includes("Trueki")
    ? title
    : `${title} | Trueki Chile`;

  const defaultKeywords = [
    "ropa segunda mano Chile",
    "moda premium usada Chile",
    "bolsos de marca Chile",
    "marketplace moda Chile",
    "ropa de marca Santiago",
    "segunda mano premium",
    "ropa autenticada Chile",
  ];

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  return [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "keywords", content: allKeywords.join(", ") },
    { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow" },
    { name: "author", content: "Trueki" },
    { name: "language", content: "Spanish" },
    { name: "geo.region", content: "CL" },
    { name: "geo.placename", content: "Santiago, Chile" },

    // Open Graph
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: canonical ?? BASE_URL },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: "Trueki" },
    { property: "og:locale", content: "es_CL" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:site", content: "@truekichile" },

    // Canonical
    ...(canonical ? [{ tagName: "link" as const, rel: "canonical", href: canonical }] : []),
  ];
}

// Prebuilt SEO configs para cada página
export const SEO = {
  home: buildSeoMeta({
    title: "Trueki — Compra y vende moda premium de segunda mano en Chile",
    description:
      "El marketplace chileno donde cada artículo pasa por autenticación física antes de ser entregado. Bolsos, zapatillas y ropa de marca verificada. Reembolso total garantizado.",
    canonical: BASE_URL,
    ogType: "website",
    keywords: [
      "comprar bolsos segunda mano Chile",
      "vender ropa de marca Chile",
      "Louis Vuitton usado Chile",
      "Gucci segunda mano Santiago",
      "zapatillas Nike segunda mano",
    ],
  }),

  search: buildSeoMeta({
    title: "Explorar artículos premium — Trueki",
    description:
      "Encuentra bolsos, zapatillas y ropa de marca de segunda mano en Chile. Todos los artículos verificados y autenticados por Trueki.",
    canonical: `${BASE_URL}/buscar`,
    keywords: ["explorar ropa marca Chile", "buscar bolsos segunda mano"],
  }),

  sell: buildSeoMeta({
    title: "Vende tu ropa de marca — Trueki",
    description:
      "Envía tu artículo a Trueki, nosotros lo verificamos, fotografiamos y publicamos gratis. Cuando se vende, tú cobras. Simple.",
    canonical: `${BASE_URL}/vender`,
    keywords: ["vender ropa marca Chile", "consignación ropa Chile"],
  }),

  authenticity: buildSeoMeta({
    title: "Garantía de autenticidad — Trueki",
    description:
      "Cada artículo en Trueki es revisado físicamente por expertos antes de ser entregado. Si es falso, reembolso del 100%.",
    canonical: `${BASE_URL}/autenticidad`,
    keywords: ["ropa autenticada Chile", "verificación autenticidad moda"],
  }),
};
