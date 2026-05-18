import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "buyer" | "seller" | "warehouse" | "admin" | "support";

interface AuthState {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  displayName: string;
  initial: string;
  avatarUrl: string | null;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null, session: null, roles: [], loading: true,
    displayName: "", initial: "", avatarUrl: null,
  });

  const setFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setState({ user: null, session: null, roles: [], loading: false, displayName: "", initial: "", avatarUrl: null });
      return;
    }

    const u = session.user;
    const roles = await fetchRoles(u.id);

    // Nombre: primero perfil de Supabase, luego metadata de Google
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", u.id)
      .single();

    const displayName =
      profile?.display_name ??
      u.user_metadata?.full_name ??
      u.user_metadata?.name ??
      u.email?.split("@")[0] ??
      "Usuario";

    const avatarUrl =
      profile?.avatar_url ??
      u.user_metadata?.avatar_url ??
      null;

    setState({
      user: u, session, roles, loading: false,
      displayName,
      initial: displayName.charAt(0).toUpperCase(),
      avatarUrl,
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setFromSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setFromSession(session));
    return () => subscription.unsubscribe();
  }, [setFromSession]);

  return state;
}

async function fetchRoles(userId: string): Promise<AppRole[]> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  return (data?.map(r => r.role as AppRole)) ?? ["buyer"];
}

export async function signOut() {
  await supabase.auth.signOut();
}
