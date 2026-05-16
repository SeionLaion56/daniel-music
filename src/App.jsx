import { useState, useCallback } from 'react';
import { LogoUploader } from './components/LogoUploader';
import { BackgroundUploader } from './components/BackgroundUploader';
import { AdminBar } from './components/admin/AdminBar';
import { LoginModal } from './components/admin/LoginModal';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ClassesSection } from './components/sections/ClassesSection';
import { EnrollSection } from './components/sections/EnrollSection';
import { EditableText } from './components/ui/EditableText';
import { useAdmin } from './hooks/useAdmin';
import { useSiteContent } from './hooks/useSiteContent';
import './App.css';

export default function App() {
  // ── Todos los hooks PRIMERO, sin excepción ──
  const { isAdmin, login, logout, authLoading } = useAdmin();
  const { content, updateContent, save, hasChanges } = useSiteContent();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleUpdate = useCallback((path, value) => {
    updateContent(path, value);
  }, [updateContent]);

  const handleLogin = useCallback(async (email, password) => {
    const success = await login(email, password);
    if (success) setShowLoginModal(false);
    return success;
  }, [login]);

  const handleBackgroundChange = useCallback((bg) => {
    updateContent(['background'], bg);
  }, [updateContent]);

  const spacing = content.sectionSpacing ?? 'normal';

  // ── Returns condicionales DESPUÉS de todos los hooks ──
  if (authLoading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </div>
  );

  return (
    <>
      {/* Fondo dinámico */}
      {content.background.type === 'default' && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, ${content.background.gradientStart} 0%, ${content.background.gradientEnd} 100%)`,
          }}
        />
      )}
      {content.background.type === 'image' && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.background.url})` }}
        />
      )}
      {content.background.type === 'video' && (
        <video
          key={content.background.url}
          className="fixed inset-0 -z-10 w-full h-full object-cover"
          src={content.background.url}
          autoPlay loop muted playsInline
        />
      )}
      {content.background.type !== 'default' && (
        <div className="fixed inset-0 bg-black/50" style={{ zIndex: -5 }} />
      )}

      {/* Barra de admin */}
      {isAdmin && (
        <AdminBar
          onSave={save}
          onLogout={logout}
          hasChanges={hasChanges}
          spacing={spacing}
          onSpacingChange={v => handleUpdate(['sectionSpacing'], v)}
        />
      )}

      {/* Modal de login */}
      {showLoginModal && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />
      )}

      {/* Header */}
      <header className={`w-full px-4 sm:px-8 py-4 ${isAdmin ? 'mt-10' : ''}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          <LogoUploader
            logoUrl={content.logo}
            onLogoChange={url => handleUpdate(['logo'], url)}
            isAdmin={isAdmin}
          />

          <div className="text-center flex-1">
            <EditableText
              value={content.siteTitle}
              onChange={v => handleUpdate(['siteTitle'], v)}
              isAdmin={isAdmin}
              tag="h1"
              className="text-2xl sm:text-3xl font-bold text-white"
              textStyle={content.siteTitleStyle}
              onStyleChange={s => handleUpdate(['siteTitleStyle'], s)}
            />
            <EditableText
              value={content.tagline}
              onChange={v => handleUpdate(['tagline'], v)}
              isAdmin={isAdmin}
              tag="p"
              className="text-white/55 text-sm mt-0.5"
              textStyle={content.taglineStyle}
              onStyleChange={s => handleUpdate(['taglineStyle'], s)}
            />
          </div>

          <div className="flex items-center gap-2 w-40 justify-end">
            {isAdmin && (
              <BackgroundUploader
                background={content.background}
                onBackgroundChange={handleBackgroundChange}
              />
            )}
            {!isAdmin && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-white/15 hover:text-white/40 text-lg leading-none transition-colors px-2 py-1"
                title="Acceso administrador"
                aria-label="Acceso administrador"
              >
                ···
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="w-full flex-1">
        <HeroSection
          hero={content.hero}
          isAdmin={isAdmin}
          onUpdate={handleUpdate}
          spacing={spacing}
        />
        <AboutSection
          about={content.about}
          isAdmin={isAdmin}
          onUpdate={handleUpdate}
          spacing={spacing}
        />
        <ClassesSection
          classes={content.classes}
          classesTitle={content.classesTitle}
          classesTitleStyle={content.classesTitleStyle}
          isAdmin={isAdmin}
          onUpdate={handleUpdate}
          spacing={spacing}
        />
        <EnrollSection
          enrollButton={content.enrollButton}
          isAdmin={isAdmin}
          onUpdate={handleUpdate}
          spacing={spacing}
        />
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 text-center border-t border-white/10">
        <p className="text-white/25 text-sm">
          © {new Date().getFullYear()} {content.siteTitle}
        </p>
      </footer>
    </>
  );
}
