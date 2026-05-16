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
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null, session: null, roles: [], loading: true, displayName: "", initial: "",
  });

  const setFromSession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setState({ user: null, session: null, roles: [], loading: false, displayName: "", initial: "" });
      return;
    }
    const roles = await fetchRoles(session.user.id);
    const displayName =
      session.user.user_metadata?.display_name ??
      session.user.email?.split("@")[0] ?? "Usuario";
    setState({
      user: session.user, session, roles, loading: false,
      displayName, initial: displayName.charAt(0).toUpperCase(),
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
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data?.map((r) => r.role as AppRole)) ?? ["buyer"];
}

export async function signOut() {
  await supabase.auth.signOut();
}
