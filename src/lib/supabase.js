import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const fetchBusinesses = async (city = '', category = '') => {
  let query = supabase.from('businesses').select('*');
  
  if (city) query = query.ilike('city', `%${city}%`);
  if (category) query = query.ilike('category', `%${category}%`);
  
  const { data, error } = await query.limit(50);
  if (error) throw error;
  return data;
};

export const fetchBusiness = async (id) => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const fetchBusinessReviews = async (businessId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(name, avatar_url)')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const insertReview = async (businessId, userId, rating, title, content) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      business_id: businessId,
      user_id: userId,
      rating,
      title,
      content,
    });
  if (error) throw error;
  return data;
};

export const createBusiness = async (business) => {
  const { data, error } = await supabase
    .from('businesses')
    .insert([business]);
  if (error) throw error;
  return data;
};

export const updateBusiness = async (id, updates) => {
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteBusiness = async (id) => {
  const { data, error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  if (error) throw error;
  return data;
};

export const getAllReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*');
  if (error) throw error;
  return data;
};
