-- ============================================================
-- VERICLOSET FOUNDATION: ROLES, SCHEMA, RLS, AUDIT
-- ============================================================

-- ---------- ENUMS ----------
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller', 'warehouse', 'admin', 'support');

CREATE TYPE public.order_status AS ENUM (
  'pending_payment',
  'payment_authorized',
  'awaiting_seller_shipment',
  'in_transit_to_warehouse',
  'received_at_warehouse',
  'in_verification',
  'buyer_decision_required',
  'verification_approved',
  'verification_rejected',
  'awaiting_outbound_shipment',
  'in_transit_to_buyer',
  'delivered',
  'completed',
  'disputed',
  'refunded',
  'cancelled'
);

CREATE TYPE public.listing_status AS ENUM ('draft', 'published', 'flagged_for_review', 'sold', 'removed');
CREATE TYPE public.listing_condition AS ENUM ('new_with_tags', 'like_new', 'very_good', 'good', 'fair');
CREATE TYPE public.verification_verdict AS ENUM ('pass', 'fail', 'uncertain');
CREATE TYPE public.dispute_status AS ENUM ('open', 'under_review', 'resolved_refund', 'resolved_denied', 'cancelled');
CREATE TYPE public.dispute_reason AS ENUM ('not_as_described', 'suspected_fake', 'damaged_in_transit', 'other');
CREATE TYPE public.shipment_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE public.shipment_status AS ENUM ('label_created', 'in_transit', 'delivered', 'failed', 'cancelled');
CREATE TYPE public.carrier_type AS ENUM ('chilexpress', 'correoschile', 'starken');
CREATE TYPE public.brand_risk AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.payment_status AS ENUM ('none', 'authorized', 'captured', 'refunded', 'cancelled', 'failed');

-- ---------- UTILITY: updated_at trigger ----------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ---------- PROFILES ----------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  stripe_customer_id TEXT,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- USER ROLES ----------
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_warehouse_or_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('warehouse','admin'));
$$;

CREATE OR REPLACE FUNCTION public.is_support_or_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('support','admin'));
$$;

-- Auto-create profile + default buyer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.is_admin(auth.uid()));

-- user_roles policies
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins see all roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- ADDRESSES ----------
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  street TEXT NOT NULL,
  number TEXT,
  apt TEXT,
  comuna TEXT NOT NULL,
  region TEXT NOT NULL,
  postal_code TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Warehouse and admin read addresses" ON public.addresses FOR SELECT USING (public.is_warehouse_or_admin(auth.uid()));

-- ---------- BRANDS ----------
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  whitelisted BOOLEAN NOT NULL DEFAULT TRUE,
  risk_level public.brand_risk NOT NULL DEFAULT 'medium',
  min_price_clp INT DEFAULT 0,
  required_evidence_photos INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_brands_updated BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Brands public read" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins manage brands" ON public.brands FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- CATEGORIES ----------
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- LISTINGS ----------
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brands(id),
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT,
  size TEXT,
  condition public.listing_condition NOT NULL DEFAULT 'good',
  price_clp INT NOT NULL CHECK (price_clp > 0),
  status public.listing_status NOT NULL DEFAULT 'draft',
  flagged_reason TEXT,
  view_count INT NOT NULL DEFAULT 0,
  favorite_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_seller ON public.listings(seller_id);
CREATE INDEX idx_listings_brand ON public.listings(brand_id);

CREATE POLICY "Anyone reads published listings" ON public.listings FOR SELECT USING (status = 'published');
CREATE POLICY "Sellers read own listings" ON public.listings FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Warehouse and admin read all listings" ON public.listings FOR SELECT USING (public.is_warehouse_or_admin(auth.uid()) OR public.is_support_or_admin(auth.uid()));
CREATE POLICY "Sellers insert own listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = seller_id AND public.has_role(auth.uid(),'seller'));
CREATE POLICY "Sellers update own listings" ON public.listings FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers delete own listings" ON public.listings FOR DELETE USING (auth.uid() = seller_id);
CREATE POLICY "Admins manage all listings" ON public.listings FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- LISTING PHOTOS ----------
CREATE TABLE public.listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads photos of published listings" ON public.listing_photos FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND (l.status = 'published' OR l.seller_id = auth.uid() OR public.is_warehouse_or_admin(auth.uid()))));
CREATE POLICY "Sellers insert photos for own listings" ON public.listing_photos FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = auth.uid()));
CREATE POLICY "Sellers update photos for own listings" ON public.listing_photos FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = auth.uid()));
CREATE POLICY "Sellers delete photos for own listings" ON public.listing_photos FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = auth.uid()));
CREATE POLICY "Admins manage all photos" ON public.listing_photos FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- ORDERS ----------
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  shipping_address_id UUID REFERENCES public.addresses(id),
  status public.order_status NOT NULL DEFAULT 'pending_payment',
  payment_status public.payment_status NOT NULL DEFAULT 'none',
  amount_clp INT NOT NULL CHECK (amount_clp > 0),
  shipping_clp INT NOT NULL DEFAULT 0,
  fee_clp INT NOT NULL DEFAULT 0,
  total_clp INT NOT NULL,
  payment_intent_id TEXT,
  authorized_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  dispute_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Warehouse-relevant statuses
CREATE OR REPLACE FUNCTION public.is_warehouse_status(_s public.order_status)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE AS $$
  SELECT _s IN ('awaiting_seller_shipment','in_transit_to_warehouse','received_at_warehouse','in_verification','buyer_decision_required','verification_approved','verification_rejected','awaiting_outbound_shipment','in_transit_to_buyer');
$$;

CREATE POLICY "Buyers read own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers read own orders" ON public.orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Warehouse reads warehouse-status orders" ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(),'warehouse') AND public.is_warehouse_status(status));
CREATE POLICY "Admin and support read all orders" ON public.orders FOR SELECT USING (public.is_support_or_admin(auth.uid()));
CREATE POLICY "Buyers insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Warehouse update warehouse orders" ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(),'warehouse') AND public.is_warehouse_status(status));
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- ORDER EVENTS ----------
CREATE TABLE public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  status public.order_status,
  metadata JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order participants read events" ON public.order_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())) OR public.is_warehouse_or_admin(auth.uid()) OR public.is_support_or_admin(auth.uid()));
CREATE POLICY "System inserts events" ON public.order_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ---------- SHIPMENTS ----------
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  direction public.shipment_direction NOT NULL,
  carrier public.carrier_type NOT NULL,
  tracking_number TEXT,
  label_url TEXT,
  status public.shipment_status NOT NULL DEFAULT 'label_created',
  cost_clp INT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_shipments_updated BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Order participants read shipments" ON public.shipments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())) OR public.is_warehouse_or_admin(auth.uid()) OR public.is_support_or_admin(auth.uid()));
CREATE POLICY "Warehouse manages shipments" ON public.shipments FOR ALL
  USING (public.is_warehouse_or_admin(auth.uid())) WITH CHECK (public.is_warehouse_or_admin(auth.uid()));
CREATE POLICY "Sellers insert inbound shipment for own order" ON public.shipments FOR INSERT
  WITH CHECK (direction = 'inbound' AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.seller_id = auth.uid()));

-- ---------- VERIFICATION REPORTS ----------
CREATE TABLE public.verification_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES auth.users(id),
  verdict public.verification_verdict NOT NULL,
  condition_grade public.listing_condition,
  mismatch_flags TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.verification_reports ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_vr_updated BEFORE UPDATE ON public.verification_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Warehouse and admin manage verification" ON public.verification_reports FOR ALL
  USING (public.is_warehouse_or_admin(auth.uid())) WITH CHECK (public.is_warehouse_or_admin(auth.uid()));
CREATE POLICY "Order participants read verification" ON public.verification_reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())));
CREATE POLICY "Support reads verification" ON public.verification_reports FOR SELECT USING (public.is_support_or_admin(auth.uid()));

-- ---------- VERIFICATION PHOTOS ----------
CREATE TABLE public.verification_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.verification_reports(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.verification_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Warehouse manages verification photos" ON public.verification_photos FOR ALL
  USING (public.is_warehouse_or_admin(auth.uid())) WITH CHECK (public.is_warehouse_or_admin(auth.uid()));
CREATE POLICY "Order participants read verification photos" ON public.verification_photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.verification_reports vr
    JOIN public.orders o ON o.id = vr.order_id
    WHERE vr.id = report_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
  ) OR public.is_support_or_admin(auth.uid()));

-- ---------- DISPUTES ----------
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES auth.users(id),
  reason public.dispute_reason NOT NULL,
  description TEXT,
  status public.dispute_status NOT NULL DEFAULT 'open',
  resolution_notes TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_disputes_updated BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Buyer reads own disputes" ON public.disputes FOR SELECT USING (auth.uid() = opened_by);
CREATE POLICY "Order participants read disputes" ON public.disputes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())));
CREATE POLICY "Support and admin read all disputes" ON public.disputes FOR SELECT USING (public.is_support_or_admin(auth.uid()));
CREATE POLICY "Buyers open disputes on own orders" ON public.disputes FOR INSERT
  WITH CHECK (auth.uid() = opened_by AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid()));
CREATE POLICY "Support resolves disputes" ON public.disputes FOR UPDATE USING (public.is_support_or_admin(auth.uid()));

-- ---------- MESSAGES ----------
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  dispute_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  body TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read messages" ON public.messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR (order_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())))
    OR public.is_support_or_admin(auth.uid())
  );
CREATE POLICY "Participants send messages" ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND (
      (order_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())))
      OR public.is_support_or_admin(auth.uid())
    )
  );

-- ---------- NOTIFICATIONS ----------
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins insert notifications" ON public.notifications FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- ---------- PAYOUTS LEDGER ----------
CREATE TABLE public.payouts_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount_clp INT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payouts_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers read own ledger" ON public.payouts_ledger FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Admins manage ledger" ON public.payouts_ledger FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- PAYOUT REQUESTS ----------
CREATE TABLE public.payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_clp INT NOT NULL CHECK (amount_clp > 0),
  status TEXT NOT NULL DEFAULT 'pending',
  bank_info JSONB,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_pr_updated BEFORE UPDATE ON public.payout_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Sellers manage own payout requests" ON public.payout_requests FOR ALL
  USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Admins manage payout requests" ON public.payout_requests FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ---------- STRIKES ----------
CREATE TABLE public.strikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  severity INT NOT NULL DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers see own strikes" ON public.strikes FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Admins and support manage strikes" ON public.strikes FOR ALL
  USING (public.is_support_or_admin(auth.uid())) WITH CHECK (public.is_support_or_admin(auth.uid()));

-- ---------- AUDIT LOGS ----------
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type, entity_id);
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Support read audit logs" ON public.audit_logs FOR SELECT USING (public.is_support_or_admin(auth.uid()));
CREATE POLICY "Authenticated users insert audit" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger: log order status transitions
CREATE OR REPLACE FUNCTION public.audit_order_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
    VALUES (auth.uid(), 'order.status_change', 'order', NEW.id,
      jsonb_build_object('from', OLD.status, 'to', NEW.status));
    INSERT INTO public.order_events (order_id, event, status, created_by)
    VALUES (NEW.id, 'status_change', NEW.status, auth.uid());
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
    INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
    VALUES (auth.uid(), 'order.payment_status_change', 'order', NEW.id,
      jsonb_build_object('from', OLD.payment_status, 'to', NEW.payment_status));
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_audit_order AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.audit_order_status();

-- ---------- CARRIER ACCOUNTS ----------
CREATE TABLE public.carrier_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier public.carrier_type NOT NULL,
  env TEXT NOT NULL DEFAULT 'sandbox',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(carrier, env)
);
ALTER TABLE public.carrier_accounts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_ca_updated BEFORE UPDATE ON public.carrier_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Admins manage carrier accounts" ON public.carrier_accounts FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
-- Note: support cannot read carrier credentials.

-- ---------- CARRIER RATES CACHE ----------
CREATE TABLE public.carrier_rates_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  carrier public.carrier_type NOT NULL,
  quote JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.carrier_rates_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read rates cache" ON public.carrier_rates_cache FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Warehouse and admin write rates cache" ON public.carrier_rates_cache FOR ALL
  USING (public.is_warehouse_or_admin(auth.uid())) WITH CHECK (public.is_warehouse_or_admin(auth.uid()));

-- ---------- STORAGE BUCKETS ----------
INSERT INTO storage.buckets (id, name, public) VALUES
  ('listing-photos', 'listing-photos', true),
  ('verification-photos', 'verification-photos', false),
  ('shipping-labels', 'shipping-labels', false),
  ('dispute-photos', 'dispute-photos', false)
ON CONFLICT (id) DO NOTHING;

-- listing-photos: public read, sellers upload to own folder (folder = user_id)
CREATE POLICY "Listing photos public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-photos');
CREATE POLICY "Sellers upload listing photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Sellers update own listing photos" ON storage.objects FOR UPDATE
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Sellers delete own listing photos" ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- verification-photos: warehouse + admin manage; participants signed-url access via app
CREATE POLICY "Warehouse manages verification storage" ON storage.objects FOR ALL
  USING (bucket_id = 'verification-photos' AND public.is_warehouse_or_admin(auth.uid()))
  WITH CHECK (bucket_id = 'verification-photos' AND public.is_warehouse_or_admin(auth.uid()));

-- shipping-labels: warehouse + admin manage; sellers can read inbound, buyers none directly (signed urls)
CREATE POLICY "Warehouse manages shipping labels" ON storage.objects FOR ALL
  USING (bucket_id = 'shipping-labels' AND public.is_warehouse_or_admin(auth.uid()))
  WITH CHECK (bucket_id = 'shipping-labels' AND public.is_warehouse_or_admin(auth.uid()));
CREATE POLICY "Sellers read own shipping labels" ON storage.objects FOR SELECT
  USING (bucket_id = 'shipping-labels' AND auth.uid()::text = (storage.foldername(name))[1]);

-- dispute-photos: opener and support manage
CREATE POLICY "Users upload own dispute photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dispute-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users read own dispute photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'dispute-photos' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_support_or_admin(auth.uid())));
