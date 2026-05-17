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

// Ejecuta una promesa con timeout — si tarda más de ms, devuelve fallback
function withTimeout(promise, ms, fallback) {
  const timer = new Promise(resolve => setTimeout(() => resolve(fallback), ms));
  return Promise.race([promise, timer]);
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificación silenciosa en segundo plano — no bloquea el render
    withTimeout(supabase.auth.getSession(), 5000, { data: { session: null } })
      .then(async ({ data: { session } }) => {
        setIsAdmin(await withTimeout(checkIsAdmin(session), 3000, false));
      })
      .catch(() => setIsAdmin(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setIsAdmin(await withTimeout(checkIsAdmin(session), 3000, false));
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

      const isAdminUser = await withTimeout(checkIsAdmin(data.session), 5000, false);
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
  }, []);

  // Sin authLoading — la página carga inmediatamente
  return { isAdmin, login, logout };
}
