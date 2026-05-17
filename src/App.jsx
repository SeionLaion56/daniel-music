import { useState, useCallback } from 'react';
import { LogoUploader }        from './components/LogoUploader';
import { BackgroundUploader }  from './components/BackgroundUploader';
import { AdminBar }            from './components/admin/AdminBar';
import { LoginModal }          from './components/admin/LoginModal';
import { HeroSection }         from './components/sections/HeroSection';
import { AboutSection }        from './components/sections/AboutSection';
import { ClassesSection }      from './components/sections/ClassesSection';
import { EnrollSection }       from './components/sections/EnrollSection';
import { SectionWrapper }      from './components/sections/SectionWrapper';
import { AddSectionModal }     from './components/sections/AddSectionModal';
import { CustomSectionRenderer } from './components/sections/custom/CustomSectionRenderer';
import { EditableText }        from './components/ui/EditableText';
import { useAdmin }            from './hooks/useAdmin';
import { useSiteContent }      from './hooks/useSiteContent';
import './App.css';

const BUILTIN_IDS = new Set(['hero', 'about', 'classes', 'enroll']);

export default function App() {
  const { isAdmin, login, logout, authLoading } = useAdmin();
  const { content, updateContent, save, hasChanges } = useSiteContent();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal]     = useState(false);

  // ── Hooks primero, returns condicionales después ───────────────────────────
  const handleUpdate = useCallback((path, value) => {
    updateContent(path, value);
  }, [updateContent]);

  const handleLogin = useCallback(async (email, password) => {
    const ok = await login(email, password);
    if (ok) setShowLoginModal(false);
    return ok;
  }, [login]);

  const handleBackgroundChange = useCallback((bg) => {
    updateContent(['background'], bg);
  }, [updateContent]);

  // Agregar sección (builtin = restaurar, custom = nueva)
  const handleAddSection = useCallback((type, defaults, isBuiltin) => {
    if (isBuiltin) {
      // Restaurar una sección fija quitada del orden
      updateContent(['sectionOrder'], [...(content.sectionOrder ?? []), type]);
      return;
    }
    const id = `custom-${Date.now()}`;
    const newSection = { id, type, ...defaults };
    updateContent(['customSections'], { ...(content.customSections ?? {}), [id]: newSection });
    updateContent(['sectionOrder'], [...(content.sectionOrder ?? []), id]);
  }, [content.sectionOrder, content.customSections, updateContent]);

  // Actualizar campo de sección custom
  const handleUpdateCustom = useCallback((id, key, value) => {
    updateContent(['customSections', id, key], value);
  }, [updateContent]);

  // Mover sección arriba/abajo en el orden
  const handleMove = useCallback((id, direction) => {
    const order = [...(content.sectionOrder ?? [])];
    const i = order.indexOf(id);
    const j = direction === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    updateContent(['sectionOrder'], order);
  }, [content.sectionOrder, updateContent]);

  // Eliminar / ocultar sección
  const handleDelete = useCallback((id) => {
    const newOrder = (content.sectionOrder ?? []).filter(s => s !== id);
    updateContent(['sectionOrder'], newOrder);
    // Si es custom, borra los datos también
    if (!BUILTIN_IDS.has(id)) {
      const newCustom = { ...(content.customSections ?? {}) };
      delete newCustom[id];
      updateContent(['customSections'], newCustom);
    }
  }, [content.sectionOrder, content.customSections, updateContent]);

  const spacing  = content.sectionSpacing ?? 'normal';
  const secOrder = content.sectionOrder   ?? ['hero', 'about', 'classes', 'enroll'];

  // Secciones fijas que están ocultas (no están en el orden)
  const hiddenBuiltins = ['hero', 'about', 'classes', 'enroll'].filter(id => !secOrder.includes(id));

  // ── Return condicional DESPUÉS de todos los hooks ─────────────────────────
  if (authLoading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </div>
  );

  return (
    <>
      {/* Fondo */}
      {content.background.type === 'default' && (
        <div className="fixed inset-0 -z-10"
          style={{ background: `linear-gradient(135deg, ${content.background.gradientStart} 0%, ${content.background.gradientEnd} 100%)` }} />
      )}
      {content.background.type === 'image' && (
        <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.background.url})` }} />
      )}
      {content.background.type === 'video' && (
        <video key={content.background.url}
          className="fixed inset-0 -z-10 w-full h-full object-cover"
          src={content.background.url} autoPlay loop muted playsInline />
      )}
      {content.background.type !== 'default' && (
        <div className="fixed inset-0 bg-black/50" style={{ zIndex: -5 }} />
      )}

      {/* Barras y modales */}
      {isAdmin && (
        <AdminBar onSave={save} onLogout={logout} hasChanges={hasChanges}
          spacing={spacing} onSpacingChange={v => handleUpdate(['sectionSpacing'], v)} />
      )}
      {showLoginModal && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />
      )}
      {showAddModal && (
        <AddSectionModal
          onAdd={handleAddSection}
          onClose={() => setShowAddModal(false)}
          hiddenBuiltins={hiddenBuiltins}
        />
      )}

      {/* FAB — botón flotante para agregar secciones (solo admin) */}
      {isAdmin && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-5 z-30 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center transition-all hover:scale-110"
          title="Agregar sección"
          aria-label="Agregar sección"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      )}

      {/* Header */}
      <header className={`w-full px-4 sm:px-8 py-3 sm:py-4 ${isAdmin ? 'mt-12 sm:mt-10' : ''}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <LogoUploader logoUrl={content.logo}
            onLogoChange={url => handleUpdate(['logo'], url)} isAdmin={isAdmin} />

          <div className="text-center flex-1 min-w-0">
            <EditableText value={content.siteTitle}
              onChange={v => handleUpdate(['siteTitle'], v)}
              isAdmin={isAdmin} tag="h1"
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-white"
              textStyle={content.siteTitleStyle}
              onStyleChange={s => handleUpdate(['siteTitleStyle'], s)} />
            <EditableText value={content.tagline}
              onChange={v => handleUpdate(['tagline'], v)}
              isAdmin={isAdmin} tag="p"
              className="text-white/55 text-xs sm:text-sm mt-0.5 hidden sm:block"
              textStyle={content.taglineStyle}
              onStyleChange={s => handleUpdate(['taglineStyle'], s)} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <BackgroundUploader background={content.background}
                onBackgroundChange={handleBackgroundChange} />
            )}
            {!isAdmin && (
              <button onClick={() => setShowLoginModal(true)}
                className="text-white/15 hover:text-white/40 text-lg leading-none transition-colors px-2 py-1"
                title="Acceso administrador" aria-label="Acceso administrador">
                ···
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Secciones */}
      <main className="w-full flex-1">
        {secOrder.map((sectionId, index) => {
          const isCustom  = !BUILTIN_IDS.has(sectionId);
          const customData = isCustom ? content.customSections?.[sectionId] : null;

          const sectionContent = (() => {
            if (sectionId === 'hero') return (
              <HeroSection hero={content.hero} isAdmin={isAdmin}
                onUpdate={handleUpdate} spacing={spacing} />
            );
            if (sectionId === 'about') return (
              <AboutSection about={content.about} isAdmin={isAdmin}
                onUpdate={handleUpdate} spacing={spacing} />
            );
            if (sectionId === 'classes') return (
              <ClassesSection
                classes={content.classes}
                classesTitle={content.classesTitle || 'Clases'}
                classesTitleStyle={content.classesTitleStyle}
                isAdmin={isAdmin} onUpdate={handleUpdate} spacing={spacing} />
            );
            if (sectionId === 'enroll') return (
              <EnrollSection enrollButton={content.enrollButton}
                isAdmin={isAdmin} onUpdate={handleUpdate} spacing={spacing} />
            );
            if (isCustom && customData) return (
              <CustomSectionRenderer
                section={customData}
                isAdmin={isAdmin}
                onUpdate={(key, value) => handleUpdateCustom(sectionId, key, value)}
              />
            );
            return null;
          })();

          if (!sectionContent) return null;

          return (
            <SectionWrapper
              key={sectionId}
              index={index}
              total={secOrder.length}
              isAdmin={isAdmin}
              isCustom={isCustom}
              onMoveUp={() => handleMove(sectionId, 'up')}
              onMoveDown={() => handleMove(sectionId, 'down')}
              onDelete={() => handleDelete(sectionId)}
            >
              {sectionContent}
            </SectionWrapper>
          );
        })}
      </main>

      <footer className="w-full px-6 py-6 sm:py-8 text-center border-t border-white/10">
        <p className="text-white/25 text-sm">© {new Date().getFullYear()} {content.siteTitle}</p>
      </footer>
    </>
  );
}
