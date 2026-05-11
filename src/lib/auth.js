import { supabase } from './supabase';

export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: data.user.id,
        email,
        name,
      });
    if (profileError) throw profileError;
  }
  
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', session.user.id)
    .maybeSingle();
  
  return data;
};

export const checkAdminStatus = async (userId) => {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('auth_id', userId)
    .maybeSingle();
  
  return data?.is_admin || false;
};

export const adminSignIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  const isAdmin = await checkAdminStatus(data.user.id);
  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error('Not an admin account');
  }
  
  return data;
};
