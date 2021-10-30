import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
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

  console.log({ data, error });

  if (error) throw error;

  return data;
};

export const updateFontRecord = async (fontId, fontData) => {
  const fontRecord = {
    font_name: fontData.name,
    font_css: fontData.css,
    font_category: fontData.category,
    allowed_domains: [],
    user_id: fontData.user
  };

  const { data, error } = await supabase
    .from('fonts')
    .insert([fontRecord], { upsert: false })
    .eq('id', fontId);

  if (error) throw error;

  return data;
};

export const getActiveProductsWithPrices = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const updateUserName = async (user, name) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
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
