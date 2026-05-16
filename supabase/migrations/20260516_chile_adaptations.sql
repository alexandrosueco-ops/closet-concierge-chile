-- ============================================================
-- VERICLOSET CHILE — Migración adaptaciones chilenas
-- Reemplaza campos Stripe por MercadoPago
-- Agrega: WhatsApp, Fintoc, RUT vendedor, Shipit tracking
-- ============================================================

-- ─── 1. Actualizar profiles: MP en vez de Stripe ─────────────────────────────

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS stripe_customer_id,
  ADD COLUMN IF NOT EXISTS mp_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS mp_merchant_id TEXT,        -- Para vendedores conectados a MP Marketplace
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT,        -- Puede diferir del teléfono principal
  ADD COLUMN IF NOT EXISTS rut TEXT,                   -- RUT chileno del vendedor
  ADD COLUMN IF NOT EXISTS rut_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS datos_bancarios JSONB;      -- { banco, tipo_cuenta, numero, nombre }

-- ─── 2. Actualizar orders: campos MP + Shipit ─────────────────────────────────

ALTER TABLE public.orders
  DROP COLUMN IF EXISTS payment_intent_id,
  ADD COLUMN IF NOT EXISTS mp_payment_id TEXT,         -- ID de pago en MercadoPago
  ADD COLUMN IF NOT EXISTS mp_preference_id TEXT,      -- ID de preferencia (checkout)
  ADD COLUMN IF NOT EXISTS mp_status TEXT,             -- Estado raw de MP
  ADD COLUMN IF NOT EXISTS mp_released_at TIMESTAMPTZ, -- Cuándo se liberó al vendedor
  ADD COLUMN IF NOT EXISTS buyer_protection_clp INT DEFAULT 0, -- 5% cargo comprador
  ADD COLUMN IF NOT EXISTS platform_fee_clp INT DEFAULT 0;     -- Fee total de VeriCloset

-- ─── 3. Actualizar shipments: campos Shipit ───────────────────────────────────

ALTER TABLE public.shipments
  ADD COLUMN IF NOT EXISTS shipit_package_id TEXT,    -- ID en Shipit.cl
  ADD COLUMN IF NOT EXISTS carrier_name TEXT,
  ADD COLUMN IF NOT EXISTS label_pdf_url TEXT,        -- URL PDF etiqueta
  ADD COLUMN IF NOT EXISTS label_zpl TEXT,            -- ZPL para Zebra
  ADD COLUMN IF NOT EXISTS estimated_delivery TEXT;

-- ─── 4. Tabla payouts: transferencias con Fintoc ──────────────────────────────

CREATE TABLE IF NOT EXISTS public.seller_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount_clp INT NOT NULL CHECK (amount_clp > 0),
  fintoc_payment_id TEXT,
  fintoc_status TEXT DEFAULT 'pending',
  datos_bancarios JSONB NOT NULL,              -- Snapshot de datos al momento del pago
  description TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_payouts_updated
  BEFORE UPDATE ON public.seller_payouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Vendedores ven sus propios pagos"
  ON public.seller_payouts FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Admins gestionan todos los pagos"
  ON public.seller_payouts FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ─── 5. Tabla notificaciones WhatsApp ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',   -- sent | failed | delivered | read
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins ven logs de WhatsApp"
  ON public.whatsapp_logs FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Sistema inserta logs"
  ON public.whatsapp_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── 6. Índices ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_orders_mp_payment ON public.orders(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_shipments_shipit ON public.shipments(shipit_package_id);
CREATE INDEX IF NOT EXISTS idx_payouts_seller ON public.seller_payouts(seller_id);
CREATE INDEX IF NOT EXISTS idx_payouts_order ON public.seller_payouts(order_id);

-- ─── 7. Insertar marcas iniciales para Chile ──────────────────────────────────

INSERT INTO public.brands (slug, name, whitelisted, risk_level, min_price_clp, required_evidence_photos)
VALUES
  -- Alta gama — alta verificación
  ('louis-vuitton',  'Louis Vuitton',    true, 'high',   150000, 6),
  ('gucci',          'Gucci',            true, 'high',   120000, 6),
  ('chanel',         'Chanel',           true, 'high',   200000, 6),
  ('prada',          'Prada',            true, 'high',   100000, 6),
  ('hermes',         'Hermès',           true, 'high',   300000, 8),
  ('dior',           'Dior',             true, 'high',   120000, 6),
  -- Media gama
  ('balenciaga',     'Balenciaga',       true, 'medium',  80000, 4),
  ('saint-laurent',  'Saint Laurent',    true, 'medium',  90000, 4),
  ('bottega-veneta', 'Bottega Veneta',   true, 'medium',  80000, 4),
  ('burberry',       'Burberry',         true, 'medium',  50000, 4),
  ('coach',          'Coach',            true, 'medium',  30000, 3),
  ('michael-kors',   'Michael Kors',     true, 'medium',  25000, 3),
  -- Sneakers (populares en Chile)
  ('jordan',         'Air Jordan',       true, 'medium',  60000, 4),
  ('nike',           'Nike',             true, 'low',     25000, 2),
  ('adidas',         'Adidas',           true, 'low',     20000, 2),
  ('new-balance',    'New Balance',      true, 'low',     30000, 2),
  ('converse',       'Converse',         true, 'low',     15000, 2),
  ('vans',           'Vans',             true, 'low',     12000, 2),
  -- Lujo accesible / Populares Chile
  ('lacoste',        'Lacoste',          true, 'low',     25000, 2),
  ('polo-ralph-lauren', 'Ralph Lauren',  true, 'low',     30000, 3)
ON CONFLICT (slug) DO UPDATE SET
  whitelisted = EXCLUDED.whitelisted,
  risk_level = EXCLUDED.risk_level,
  min_price_clp = EXCLUDED.min_price_clp,
  required_evidence_photos = EXCLUDED.required_evidence_photos;

-- ─── 8. Categorías chilenas ───────────────────────────────────────────────────

INSERT INTO public.categories (slug, name) VALUES
  ('bolsos',      'Bolsos'),
  ('zapatillas',  'Zapatillas'),
  ('ropa-mujer',  'Ropa mujer'),
  ('ropa-hombre', 'Ropa hombre'),
  ('accesorios',  'Accesorios'),
  ('joyas',       'Joyas y relojes')
ON CONFLICT (slug) DO NOTHING;

-- ─── 9. Función helper: calcular estado de pago para el vendedor ──────────────

CREATE OR REPLACE FUNCTION public.seller_balance(_seller_id UUID)
RETURNS INT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(SUM(amount_clp), 0)::INT
  FROM public.payouts_ledger
  WHERE seller_id = _seller_id
    AND type = 'payout_credit';
$$;
