import { supabase } from './supabase';

const BUCKET = 'site-images';
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  // SVG excluido: puede contener JavaScript ejecutable
  'video/mp4',
]);

// Magic bytes para verificar que el archivo es realmente lo que dice ser
const MAGIC_BYTES = {
  'image/png':  [0x89, 0x50, 0x4e, 0x47],
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
  'video/mp4':  [0x00, 0x00, 0x00],        // ftyp box (bytes 4-7)
};

async function verifyMagicBytes(file) {
  // SVG es XML, no tiene magic bytes binarios — lo validamos por extensión + tipo
  if (file.type === 'image/svg+xml') return true;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const bytes = new Uint8Array(e.target.result);
      const expected = MAGIC_BYTES[file.type];
      if (!expected) { resolve(true); return; } // tipo sin magic bytes conocido
      resolve(expected.every((byte, i) => bytes[i] === byte));
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
}

export async function uploadToStorage(file) {
  // 1. Tipo MIME permitido
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Tipo de archivo no permitido. Solo PNG, JPEG, WebP, SVG y MP4.');
  }

  // 2. Tamaño máximo
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('El archivo supera el límite de 10 MB.');
  }

  // 3. Verificación de magic bytes (no confiar solo en el nombre)
  const magicOk = await verifyMagicBytes(file);
  if (!magicOk) {
    throw new Error('El archivo no corresponde al tipo declarado.');
  }

  // 4. Nombre de archivo seguro (sin path traversal)
  const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(safeName, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
  return data.publicUrl;
}
