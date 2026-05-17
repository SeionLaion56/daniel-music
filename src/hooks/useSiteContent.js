import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchContent, saveContent } from '../lib/supabaseContent';

const DEFAULT_CONTENT = {
  siteTitle: 'Daniel - Clases de Música',
  siteTitleStyle: {},
  tagline: 'Flauta y canto para todos los niveles',
  taglineStyle: {},
  sectionSpacing: 'normal',
  logo: null,
  background: {
    type: 'default',
    url: null,
    gradientStart: '#1a1a2e',
    gradientEnd: '#16213e',
  },
  hero: {
    title: 'Descubre el Poder de tu Música',
    titleStyle: {},
    subtitle: 'Clases personalizadas de flauta y canto para principiantes y avanzados. Aprende a tu ritmo con un docente comprometido con tu progreso.',
    subtitleStyle: {},
    image: null,
  },
  about: {
    title: 'Sobre Daniel',
    titleStyle: {},
    text: 'Soy Daniel, músico profesional con años de experiencia en flauta traversa y técnica vocal. Mi pasión es enseñar y acompañar a cada alumno en su camino musical, adaptando las clases a su nivel, objetivos y ritmo de aprendizaje.',
    textStyle: {},
    image: null,
  },
  classesTitle: 'Clases',
  classesTitleStyle: {},
  classes: [
    {
      id: 1,
      title: 'Flauta Traversa',
      titleStyle: {},
      description: 'Desde las notas básicas hasta repertorio avanzado. Trabajamos postura, respiración, digitación y expresión musical. Clases para todas las edades y niveles.',
      descriptionStyle: {},
      image: null,
    },
    {
      id: 2,
      title: 'Canto',
      titleStyle: {},
      description: 'Desarrollá tu voz con técnica vocal, respiración diafragmática, afinación y expresión artística. Un espacio cálido y profesional para encontrar tu sonido único.',
      descriptionStyle: {},
      image: null,
    },
  ],
  // Orden de las secciones fijas (se puede reordenar)
  sectionOrder: ['hero', 'about', 'classes', 'enroll'],
  // Secciones personalizadas añadidas por el admin
  customSections: {},

  enrollButton: {
    text: 'Inscríbete Ahora',
    url: '',
    tagline: 'Dá el primer paso hacia tu camino musical',
    taglineStyle: {},
  },
};

function deepSet(obj, path, value) {
  if (!path.length) return value;
  const [head, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[head] = rest.length
    ? deepSet(obj[head] ?? (typeof rest[0] === 'number' ? [] : {}), rest, value)
    : value;
  return copy;
}

function mergeClass(saved) {
  return {
    titleStyle: {},
    descriptionStyle: {},
    ...saved,
  };
}

function mergeWithDefaults(p) {
  if (!p || typeof p !== 'object') return DEFAULT_CONTENT;
  return {
    ...DEFAULT_CONTENT,
    ...p,
    siteTitleStyle:     p.siteTitleStyle     ?? {},
    taglineStyle:       p.taglineStyle       ?? {},
    sectionSpacing:     p.sectionSpacing     ?? 'normal',
    background: { ...DEFAULT_CONTENT.background, ...(p.background ?? {}) },
    hero: {
      ...DEFAULT_CONTENT.hero,
      ...(p.hero ?? {}),
      titleStyle:    p.hero?.titleStyle    ?? {},
      subtitleStyle: p.hero?.subtitleStyle ?? {},
    },
    about: {
      ...DEFAULT_CONTENT.about,
      ...(p.about ?? {}),
      titleStyle: p.about?.titleStyle ?? {},
      textStyle:  p.about?.textStyle  ?? {},
    },
    classesTitle:      p.classesTitle      ?? 'Clases',
    classesTitleStyle: p.classesTitleStyle ?? {},
    classes: (p.classes ?? DEFAULT_CONTENT.classes).map(mergeClass),
    sectionOrder:   p.sectionOrder   ?? ['hero', 'about', 'classes', 'enroll'],
    customSections: p.customSections ?? {},
    enrollButton: {
      ...DEFAULT_CONTENT.enrollButton,
      ...(p.enrollButton ?? {}),
      tagline:      p.enrollButton?.tagline      ?? 'Dá el primer paso hacia tu camino musical',
      taglineStyle: p.enrollButton?.taglineStyle ?? {},
    },
  };
}

export function useSiteContent() {
  const [content, setContent]     = useState(DEFAULT_CONTENT);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading]     = useState(true);
  const contentRef                = useRef(content);

  // Mantener ref sincronizada para acceso en callbacks async
  useEffect(() => { contentRef.current = content; }, [content]);

  // Cargar contenido desde Supabase al montar
  useEffect(() => {
    fetchContent()
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setContent(mergeWithDefaults(data));
        }
      })
      .catch(() => {}) // Si falla, usa DEFAULT_CONTENT
      .finally(() => setLoading(false));
  }, []);

  const updateContent = useCallback((path, value) => {
    setContent(prev => deepSet(prev, path, value));
    setHasChanges(true);
  }, []);

  const save = useCallback(async () => {
    try {
      await saveContent(contentRef.current);
      setHasChanges(false);
    } catch {
      alert('Error al guardar. Verificá tu conexión e intentá de nuevo.');
    }
  }, []);

  return { content, updateContent, save, hasChanges, loading };
}
