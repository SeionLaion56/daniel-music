import { useState, useCallback } from 'react';

const ADMINS = [
  { username: 'daniel', password: 'daniel2024' },
  { username: 'admin', password: 'mollo2024' },
];

const SESSION_KEY = 'music_admin_session';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  const login = useCallback((username, password) => {
    const match = ADMINS.find(a => a.username === username && a.password === password);
    if (match) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  }, []);

  return { isAdmin, login, logout };
}
