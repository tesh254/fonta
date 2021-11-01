import { createClient } from '@supabase/supabase-js';
import { v4 } from 'node_modules/uuid/dist';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const createFontRecord = async (fontData) => {
  const fontRecord = {
    font_name: fontData.name,
    font_css: fontData.css,
    font_urls: fontData.fonts,
    font_category: fontData.category,
    allowed_domains: [],
    user_id: fontData.user,
    font_weight: fontData.font_weight,
    font_style: 'normal',
    id: v4()
  };

  const { data, error } = await supabase.from('fonts').insert([fontRecord]);
  if (error) throw error;

  return data;
};

export const subscribeToFonts = async (onUpdate) => {
  supabase
    .from('fonts')
    .on('*', (payload) => {
      onUpdate(payload.data[0]);
    })
    .subscribe();
};

export const getFontMetric = async (fontId) => {
  const { data, error } = await supabase
    .from('font_metrics')
    .select('*')
    .match({ font_id: fontId });
  if (error) {
    throw error;
  }

  return data;
};

export const updateFontRecord = async (fontId, fontData) => {
  const fontRecord = {
    font_name: fontData.font_name,
    font_css: fontData.font_css,
    font_category: fontData.font_category,
    allowed_domains: []
  };

  const { data, error } = await supabase
    .from('fonts')
    .update(fontRecord)
    .match({ id: fontId });

  if (error) throw error;

  return data;
};

export const getFontsBasedByUser = async (userId) => {
  const { data, error, count } = await supabase
    .from('fonts')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  } else {
    return {
      fonts: data,
      total: count
    };
  }
};

export const createFonts = async (fontData) => {
  const { error, data } = await supabase.from('fonts').insert(fontData);

  if (error) throw error;

  return data;
};

export const updateFont = async (fontId, fontData) => {
  const { error, data } = await supabase
    .from('fonts')
    .update({
      ...fontData
    })
    .eq('id', fontId);

  if (error) throw error;

  return data;
};
