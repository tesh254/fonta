import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getUser = async (token) => {
  const { data, error } = await supabaseAdmin.auth.api.getUser(token);

  if (error) {
    throw error;
  }

  return data;
};

export const getFontById = async (fontId) => {
  const { data, error } = await supabaseAdmin
    .from('fonts')
    .select('*')
    .eq('id', fontId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createFontMetric = async (fontData) => {
  const { data, error } = await supabaseAdmin
    .from('font_metrics')
    .insert([fontData]);

  if (error) {
    throw error;
  }

  return data;
};
