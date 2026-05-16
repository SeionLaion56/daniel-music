import { useState, useCallback } from 'react';

const STORAGE_KEY = 'daniel_music_content';
const CONTENT_VERSION = 2; // incrementar cuando se agregan campos nuevos

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

function mergeClass(saved, def) {
  return {
    ...def,
    ...saved,
    titleStyle: saved.titleStyle ?? {},
    descriptionStyle: saved.descriptionStyle ?? {},
  };
}

function loadContent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const p = JSON.parse(stored);
      // Si los datos son de una versión anterior, migramos preservando lo que se pueda
      // pero garantizando que todos los campos nuevos existan
      if ((p._version ?? 1) < CONTENT_VERSION) {
        console.info('[useSiteContent] Migrando datos al formato v' + CONTENT_VERSION);
      }
      return {
        ...DEFAULT_CONTENT,
        ...p,
        siteTitleStyle: p.siteTitleStyle ?? {},
        taglineStyle: p.taglineStyle ?? {},
        sectionSpacing: p.sectionSpacing ?? 'normal',
        background: { ...DEFAULT_CONTENT.background, ...p.background },
        hero: {
          ...DEFAULT_CONTENT.hero,
          ...p.hero,
          titleStyle: p.hero?.titleStyle ?? {},
          subtitleStyle: p.hero?.subtitleStyle ?? {},
        },
        about: {
          ...DEFAULT_CONTENT.about,
          ...p.about,
          titleStyle: p.about?.titleStyle ?? {},
          textStyle: p.about?.textStyle ?? {},
        },
        classesTitle: p.classesTitle ?? 'Clases',
        classesTitleStyle: p.classesTitleStyle ?? {},
        classes: (p.classes ?? DEFAULT_CONTENT.classes).map(c => mergeClass(c, {})),
        enrollButton: {
          ...DEFAULT_CONTENT.enrollButton,
          ...p.enrollButton,
          tagline: p.enrollButton?.tagline ?? 'Dá el primer paso hacia tu camino musical',
          taglineStyle: p.enrollButton?.taglineStyle ?? {},
        },
      };
    }
  } catch {}
  return DEFAULT_CONTENT;
}

export function useSiteContent() {
  const [content, setContent] = useState(loadContent);
  const [hasChanges, setHasChanges] = useState(false);

  const updateContent = useCallback((path, value) => {
    setContent(prev => deepSet(prev, path, value));
    setHasChanges(true);
  }, []);

  const save = useCallback(() => {
    setContent(prev => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, _version: CONTENT_VERSION }));
      } catch {}
      return prev;
    });
    setHasChanges(false);
  }, []);

  return { content, updateContent, save, hasChanges };
}
