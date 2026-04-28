-- Set search_path on remaining functions
ALTER FUNCTION public.is_warehouse_status(public.order_status) SET search_path = public;
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

-- Revoke EXECUTE from anon/authenticated on internal role-check helpers
-- (RLS policies still work because they execute in the definer's context)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_warehouse_or_admin(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_support_or_admin(uuid) FROM anon, authenticated;

-- Restrict public listing-photos: drop broad SELECT, allow only direct file fetch (no listing)
DROP POLICY IF EXISTS "Listing photos public read" ON storage.objects;
-- Allow read of individual objects only when path is well-formed (user_id/listing_id/file)
CREATE POLICY "Listing photos read by path" ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-photos' AND (storage.foldername(name))[1] IS NOT NULL);
