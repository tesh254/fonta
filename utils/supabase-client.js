import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
