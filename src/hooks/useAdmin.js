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
    return false;
  }
}

export function useAdmin() {
  const [isAdmin, setIsAdmin]         = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Timeout de seguridad: si Supabase no responde en 4s, mostramos el sitio igual
    const timeout = setTimeout(() => setAuthLoading(false), 4000);

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setIsAdmin(await checkIsAdmin(session));
      })
      .catch(() => setIsAdmin(false))
      .finally(() => {
        clearTimeout(timeout);
        setAuthLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setIsAdmin(await checkIsAdmin(session));
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return false;
    const isAdminUser = await checkIsAdmin(data.session);
    if (!isAdminUser) {
      await supabase.auth.signOut();
      return false;
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { isAdmin, login, logout, authLoading };
}
