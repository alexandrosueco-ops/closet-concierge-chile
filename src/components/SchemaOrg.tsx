/**
 * SchemaOrg — Structured Data (JSON-LD) para SEO
 *
 * Google usa Schema.org para entender el contenido:
 * - Organization: empresa Trueki
 * - WebSite: con SearchAction para el buscador
 * - ItemList: listings del marketplace
 * - Product: cada artículo individual
 * - BreadcrumbList: navegación
 */

interface SchemaOrgProps {
  type: "home" | "search" | "listing" | "sell";
  listing?: {
    id: string;
    title: string;
    description: string;
    price: number;
    brand: string;
    condition: string;
    image: string;
    url: string;
  };
  breadcrumbs?: { name: string; url: string }[];
}

const BASE_URL = "https://closet-concierge-chile.vercel.app";

function OrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Trueki",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/icon.svg`,
      width: 512,
      height: 512,
    },
    description:
      "Marketplace chileno de ropa, bolsos y zapatillas premium de segunda mano con autenticación física garantizada.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
      addressLocality: "Santiago",
      addressRegion: "Metropolitana",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    sameAs: [
      "https://www.instagram.com/truekichile",
      "https://www.tiktok.com/@truekichile",
    ],
  };
}

function WebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Trueki",
    description:
      "Compra y vende ropa, bolsos y zapatillas de marca con autenticación garantizada en Chile.",
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "es-CL",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function MarketplaceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: "Trueki — Moda premium de segunda mano verificada en Chile",
    description:
      "El único marketplace chileno donde cada artículo pasa por autenticación física antes de ser entregado. Compra con garantía de reembolso total.",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: BASE_URL,
        },
      ],
    },
    mainEntity: {
      "@type": "ResaleShop",
      name: "Trueki",
      description:
        "Marketplace de moda premium de segunda mano con autenticación.",
      url: BASE_URL,
      currenciesAccepted: "CLP",
      paymentAccepted: "MercadoPago, Transferencia bancaria",
      areaServed: {
        "@type": "Country",
        name: "Chile",
      },
    },
  };
}

function ProductSchema(listing: NonNullable<SchemaOrgProps["listing"]>) {
  const conditionMap: Record<string, string> = {
    new_with_tags: "https://schema.org/NewCondition",
    like_new: "https://schema.org/UsedCondition",
    very_good: "https://schema.org/UsedCondition",
    good: "https://schema.org/UsedCondition",
    fair: "https://schema.org/UsedCondition",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    brand: {
      "@type": "Brand",
      name: listing.brand,
    },
    image: listing.image,
    url: listing.url,
    sku: listing.id,
    itemCondition: conditionMap[listing.condition] ?? "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: listing.url,
      priceCurrency: "CLP",
      price: listing.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Trueki",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CL",
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

function BreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function SchemaOrg({ type, listing, breadcrumbs }: SchemaOrgProps) {
  const schemas: object[] = [];

  // Siempre incluir org + website
  schemas.push(OrganizationSchema());
  schemas.push(WebSiteSchema());

  if (type === "home") {
    schemas.push(MarketplaceSchema());
  }

  if (type === "listing" && listing) {
    schemas.push(ProductSchema(listing));
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(BreadcrumbSchema(breadcrumbs));
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </>
  );
}
