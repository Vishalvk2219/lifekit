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

export async function forgotPassword(email) {
  return await supabase.auth.resetPasswordForEmail(email);
}
