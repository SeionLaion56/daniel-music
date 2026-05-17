import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

async function checkIsAdmin(session) {
  if (!session) return false;
  const { data } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', session.user.id)
    .single();
  return !!data;
}

export function useAdmin() {
  const [isAdmin, setIsAdmin]         = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setIsAdmin(await checkIsAdmin(session));
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setAuthLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setIsAdmin(await checkIsAdmin(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return false;
    // Doble verificación: que sea un admin registrado
    const isAdminUser = await checkIsAdmin(data.session);
    if (!isAdminUser) {
      await supabase.auth.signOut(); // Logout inmediato si no es admin
      return false;
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { isAdmin, login, logout, authLoading };
}
