import { useState, useEffect } from 'react';

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutos
const RATE_KEY     = 'login_attempts';

function getAttempts() {
  try {
    const data = JSON.parse(sessionStorage.getItem(RATE_KEY) || '[]');
    const now  = Date.now();
    return data.filter(t => now - t < WINDOW_MS);
  } catch { return []; }
}

function recordAttempt() {
  const attempts = [...getAttempts(), Date.now()];
  sessionStorage.setItem(RATE_KEY, JSON.stringify(attempts));
  return attempts.length;
}

function getBlockedSeconds() {
  const attempts = getAttempts();
  if (attempts.length < MAX_ATTEMPTS) return 0;
  const oldest  = Math.min(...attempts);
  const elapsed = Date.now() - oldest;
  return Math.max(0, Math.ceil((WINDOW_MS - elapsed) / 1000));
}

export function LoginModal({ onLogin, onClose }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [blocked, setBlocked]   = useState(getBlockedSeconds());

  // Countdown cuando está bloqueado
  useEffect(() => {
    if (blocked <= 0) return;
    const timer = setInterval(() => {
      const secs = getBlockedSeconds();
      setBlocked(secs);
      if (secs <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [blocked]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Rate limit check
    const secs = getBlockedSeconds();
    if (secs > 0) {
      setBlocked(secs);
      setError(`Demasiados intentos. Esperá ${Math.ceil(secs / 60)} min.`);
      return;
    }

    setLoading(true);
    const success = await onLogin(email, password);

    if (!success) {
      const total = recordAttempt();
      const remaining = MAX_ATTEMPTS - total;
      if (remaining <= 0) {
        setBlocked(getBlockedSeconds());
        setError('Cuenta bloqueada temporalmente por seguridad.');
      } else {
        setError(`Email o contraseña incorrectos. ${remaining} intento${remaining === 1 ? '' : 's'} restante${remaining === 1 ? '' : 's'}.`);
      }
    }

    setLoading(false);
  };

  const isBlocked = blocked > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-1">Acceso Admin</h2>
        <p className="text-white/50 text-sm mb-6">Solo para propietarios del sitio</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-white/70 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
              disabled={isBlocked}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-400/60 transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isBlocked}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-400/60 transition-all disabled:opacity-50"
            />
          </div>

          {isBlocked && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-center">
              <p className="text-red-400 text-sm font-medium">Acceso bloqueado</p>
              <p className="text-red-400/70 text-xs mt-0.5">
                {Math.floor(blocked / 60)}:{String(blocked % 60).padStart(2, '0')} restantes
              </p>
            </div>
          )}

          {error && !isBlocked && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-1">
            <button
              type="submit"
              disabled={loading || isBlocked || !email || !password}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
