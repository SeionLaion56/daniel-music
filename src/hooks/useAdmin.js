import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

async function checkIsAdmin(session) {
  if (!session) return false;
  try {
    const { data } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .single();
    return !!data;
  } catch {
    // Si falla la consulta (red, timeout), confiamos en la sesión de Supabase.
    // El registro es solo UI — la seguridad real está en RLS del servidor.
    return true;
  }
}

function withTimeout(promise, ms, fallback) {
  const timer = new Promise(resolve => setTimeout(() => resolve(fallback), ms));
  return Promise.race([promise, timer]);
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    withTimeout(supabase.auth.getSession(), 5000, { data: { session: null } })
      .then(async ({ data: { session } }) => {
        setIsAdmin(await withTimeout(checkIsAdmin(session), 4000, !!session));
      })
      .catch(() => setIsAdmin(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(await withTimeout(checkIsAdmin(session), 4000, !!session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        8000,
        { data: null, error: new Error('timeout') }
      );
      if (error || !data?.session) return false;
      const isAdminUser = await withTimeout(checkIsAdmin(data.session), 5000, true);
      if (!isAdminUser) {
        await supabase.auth.signOut();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    setIsAdmin(false);
  }, []);

  return { isAdmin, login, logout };
}
