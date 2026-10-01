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

export async function getSummary(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const name = data?.full_name?.trim();

  return {
    title: 'Account',
    value: name || 'Profile',
    caption: 'account settings',
    href: '/(tabs)/settings',
  };
}
