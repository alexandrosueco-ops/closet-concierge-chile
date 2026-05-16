// Mock data for VeriCloset shell. Replace with Supabase queries in v2.

export type Brand = { id: string; name: string; risk: "low" | "medium" | "high" };
export type Category = { id: string; name: string };
export type Condition = "nuevo" | "como_nuevo" | "muy_bueno" | "bueno";

export type Listing = {
  id: string;
  title: string;
  brand: string;
  category: string;
  size: string;
  condition: Condition;
  priceCLP: number;
  originalPriceCLP?: number;
  photos: string[];
  sellerId: string;
  sellerName: string;
  status: ListingStatus;
  description: string;
};

export type ListingStatus =
  | "draft" | "published" | "sold_pending_seller_ship" | "inbound_in_transit"
  | "warehouse_received" | "verifying" | "buyer_decision_required"
  | "approved_ready_to_ship" | "outbound_shipped" | "delivered"
  | "completed" | "cancelled" | "failed_authenticity" | "failed_condition";

export type OrderStatus =
  | "created" | "payment_authorized" | "awaiting_seller_shipment"
  | "inbound_in_transit" | "warehouse_received" | "verification_in_progress"
  | "buyer_decision_required" | "outbound_ready" | "outbound_shipped"
  | "delivered" | "completed" | "cancelled_refunded"
  | "dispute_open" | "dispute_resolved";

export type Order = {
  id: string;
  listingId: string;
  buyerId: string;
  status: OrderStatus;
  totalCLP: number;
  createdAt: string;
  events: { at: string; status: OrderStatus; note?: string }[];
};

export const BRANDS: Brand[] = [
  { id: "louis-vuitton", name: "Louis Vuitton", risk: "high" },
  { id: "gucci", name: "Gucci", risk: "high" },
  { id: "chanel", name: "Chanel", risk: "high" },
  { id: "prada", name: "Prada", risk: "high" },
  { id: "hermes", name: "Hermès", risk: "high" },
  { id: "dior", name: "Dior", risk: "high" },
  { id: "balenciaga", name: "Balenciaga", risk: "medium" },
  { id: "saint-laurent", name: "Saint Laurent", risk: "medium" },
  { id: "bottega", name: "Bottega Veneta", risk: "medium" },
  { id: "burberry", name: "Burberry", risk: "medium" },
  { id: "nike", name: "Nike", risk: "medium" },
  { id: "jordan", name: "Jordan", risk: "medium" },
  { id: "adidas", name: "Adidas", risk: "low" },
  { id: "new-balance", name: "New Balance", risk: "low" },
  { id: "coach", name: "Coach", risk: "low" },
  { id: "michael-kors", name: "Michael Kors", risk: "low" },
];

export const CATEGORIES: Category[] = [
  { id: "bolsos", name: "Bolsos" },
  { id: "zapatillas", name: "Zapatillas" },
  { id: "ropa-mujer", name: "Ropa mujer" },
  { id: "accesorios", name: "Accesorios" },
];

const IMG = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=70`;

export const LISTINGS: Listing[] = [
  {
    id: "l1", title: "Bolso Speedy 30 monogram", brand: "Louis Vuitton",
    category: "bolsos", size: "30cm", condition: "muy_bueno",
    priceCLP: 890000, originalPriceCLP: 1650000,
    photos: [
      IMG("photo-1584917865442-de89df76afd3"),
      IMG("photo-1591561954557-26941169b49e"),
    ],
    sellerId: "u2", sellerName: "Camila R.", status: "published",
    description: "Bolso auténtico, comprado en boutique París 2021. Incluye dustbag.",
  },
  {
    id: "l2", title: "Air Jordan 1 Chicago", brand: "Jordan",
    category: "zapatillas", size: "42", condition: "como_nuevo",
    priceCLP: 320000,
    photos: [IMG("photo-1542291026-7eec264c27ff"), IMG("photo-1600185365926-3a2ce3cdb9eb")],
    sellerId: "u3", sellerName: "Diego P.", status: "published",
    description: "Usadas 2 veces. Incluye caja original.",
  },
  {
    id: "l3", title: "Cartera GG Marmont", brand: "Gucci",
    category: "accesorios", size: "Único", condition: "nuevo",
    priceCLP: 540000, originalPriceCLP: 780000,
    photos: [IMG("photo-1548036328-c9fa89d128fa"), IMG("photo-1566150905458-1bf1fc113f0d")],
    sellerId: "u4", sellerName: "Antonia V.", status: "published",
    description: "Sin uso. Etiquetas incluidas.",
  },
  {
    id: "l4", title: "Trench coat clásico", brand: "Burberry",
    category: "ropa-mujer", size: "S", condition: "bueno",
    priceCLP: 420000,
    photos: [IMG("photo-1591047139829-d91aecb6caea")],
    sellerId: "u5", sellerName: "María J.", status: "published",
    description: "Clásico atemporal. Pequeña marca interior.",
  },
  {
    id: "l5", title: "Zapatillas 550 White Green", brand: "New Balance",
    category: "zapatillas", size: "39", condition: "muy_bueno",
    priceCLP: 95000,
    photos: [IMG("photo-1600269452121-4f2416e55c28")],
    sellerId: "u2", sellerName: "Camila R.", status: "published",
    description: "Originales. Poco uso.",
  },
  {
    id: "l6", title: "Bolso Neverfull MM", brand: "Louis Vuitton",
    category: "bolsos", size: "MM", condition: "muy_bueno",
    priceCLP: 1290000,
    photos: [IMG("photo-1564422170194-896b89110ef8")],
    sellerId: "u4", sellerName: "Antonia V.", status: "published",
    description: "Excelente estado. Verificación garantizada.",
  },
];

export const MY_ORDERS: Order[] = [
  {
    id: "o1001", listingId: "l1", buyerId: "me",
    status: "verification_in_progress", totalCLP: 890000,
    createdAt: "2026-04-22T10:00:00Z",
    events: [
      { at: "2026-04-22T10:00:00Z", status: "created" },
      { at: "2026-04-22T10:01:00Z", status: "payment_authorized" },
      { at: "2026-04-22T14:00:00Z", status: "awaiting_seller_shipment" },
      { at: "2026-04-24T09:00:00Z", status: "inbound_in_transit" },
      { at: "2026-04-26T11:00:00Z", status: "warehouse_received" },
      { at: "2026-04-27T15:00:00Z", status: "verification_in_progress", note: "Revisión autenticidad en curso" },
    ],
  },
  {
    id: "o1002", listingId: "l5", buyerId: "me",
    status: "delivered", totalCLP: 95000,
    createdAt: "2026-04-10T10:00:00Z",
    events: [
      { at: "2026-04-10T10:00:00Z", status: "created" },
      { at: "2026-04-15T10:00:00Z", status: "outbound_shipped" },
      { at: "2026-04-17T10:00:00Z", status: "delivered" },
    ],
  },
];

// Seller perspective
export const SELLER_ORDERS: Order[] = [
  {
    id: "o2001", listingId: "l2", buyerId: "buyer-a",
    status: "awaiting_seller_shipment", totalCLP: 320000,
    createdAt: "2026-04-27T09:00:00Z",
    events: [
      { at: "2026-04-27T09:00:00Z", status: "payment_authorized" },
      { at: "2026-04-27T09:01:00Z", status: "awaiting_seller_shipment" },
    ],
  },
];

// Warehouse queues
export const INBOUND_QUEUE = [
  { orderId: "o3001", brand: "Chanel", title: "Bolso Classic Flap", arrivedAt: "2026-04-28T08:00:00Z" },
  { orderId: "o3002", brand: "Jordan", title: "Air Jordan 4 Bred", arrivedAt: "2026-04-28T08:30:00Z" },
];

export const VERIFY_QUEUE = [
  { orderId: "o3000", brand: "Louis Vuitton", title: "Speedy 30", since: "2026-04-28T07:00:00Z" },
];

export const OUTBOUND_QUEUE = [
  { orderId: "o2999", brand: "Gucci", title: "Cartera GG", buyer: "Sofía T.", city: "Santiago" },
];

export const conditionLabel = (c: Condition) =>
  ({ nuevo: "Nuevo", como_nuevo: "Como nuevo", muy_bueno: "Muy bueno", bueno: "Bueno" }[c]);

export const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export const orderStatusLabel = (s: OrderStatus): string =>
  ({
    created: "Creado",
    payment_authorized: "Pago autorizado",
    awaiting_seller_shipment: "Esperando envío del vendedor",
    inbound_in_transit: "En tránsito al centro",
    warehouse_received: "Recibido en bodega",
    verification_in_progress: "Verificando autenticidad",
    buyer_decision_required: "Requiere tu decisión",
    outbound_ready: "Listo para envío",
    outbound_shipped: "Enviado al comprador",
    delivered: "Entregado",
    completed: "Completado",
    cancelled_refunded: "Cancelado y reembolsado",
    dispute_open: "Disputa abierta",
    dispute_resolved: "Disputa resuelta",
  }[s]);

