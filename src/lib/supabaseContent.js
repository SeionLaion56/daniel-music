import { supabase } from './supabase';

export async function fetchContent() {
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 1)
    .single();
  if (error) return null;
  return data?.content ?? null;
}

export async function saveContent(content) {
  const { error } = await supabase
    .from('site_content')
    .update({ content })
    .eq('id', 1);
  if (error) throw error;
}
