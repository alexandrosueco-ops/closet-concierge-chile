/**
 * Hook de autenticación — VeriCloset
 * Maneja sesión, roles y redirecciones
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "buyer" | "seller" | "warehouse" | "admin" | "support";

interface AuthState {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    roles: [],
    loading: true,
  });

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const roles = await fetchRoles(session.user.id);
        setState({ user: session.user, session, roles, loading: false });
      } else {
        setState({ user: null, session: null, roles: [], loading: false });
      }
    });

    // Listener de cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const roles = await fetchRoles(session.user.id);
        setState({ user: session.user, session, roles, loading: false });
      } else {
        setState({ user: null, session: null, roles: [], loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

async function fetchRoles(userId: string): Promise<AppRole[]> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  return (data?.map((r) => r.role as AppRole)) ?? ["buyer"];
}

export async function signOut() {
  await supabase.auth.signOut();
}
