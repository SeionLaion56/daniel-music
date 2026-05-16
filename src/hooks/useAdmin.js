import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdmin() {
  const [isAdmin, setIsAdmin]       = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión existente al montar
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setIsAdmin(!!session);
      })
      .catch(() => {
        // Si Supabase falla, arrancamos como visitante normal
        setIsAdmin(false);
      })
      .finally(() => {
        setAuthLoading(false);
      });

    // Escuchar cambios de auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { isAdmin, login, logout, authLoading };
}
