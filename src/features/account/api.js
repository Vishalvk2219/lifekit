import { supabase } from '../../lib/supabase';

export async function signUp(fullName, email, password) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function sendResetOtp(email) {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });
}

export async function verifyResetOtp(email, token) {
  return await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });
}

export async function updatePassword(password) {
  return await supabase.auth.updateUser({
    password,
  });
}

export async function getProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { data: null, error: userError };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { data, error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  return {
    user: data?.user ?? null,
    error,
  };
}

export async function updateProfile(fullName) {
  return await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });
}