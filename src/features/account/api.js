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
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'lifekit://forgot-password',
  });
}

export async function updatePassword(password) {
  return await supabase.auth.updateUser({
    password,
  });
}

// ---------------- EXPORT MY DATA ----------------

export async function exportMyData() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error('No signed-in user'),
    };
  }

  const [
    profileResult,
    tasksResult,
    remindersResult,
    expensesResult,
    notesResult,
    shoppingListsResult,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id),

    supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id),

    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id),

    supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id),

    supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', user.id),
  ]);

  const results = [
    profileResult,
    tasksResult,
    remindersResult,
    expensesResult,
    notesResult,
    shoppingListsResult,
  ];

  const failedResult = results.find(
    (result) => result.error
  );

  if (failedResult) {
    return {
      data: null,
      error: failedResult.error,
    };
  }

  const shoppingLists = shoppingListsResult.data || [];

  const listIds = shoppingLists.map(
    (list) => list.id
  );

  let shoppingItems = [];

  if (listIds.length > 0) {
    const {
      data,
      error,
    } = await supabase
      .from('shopping_items')
      .select('*')
      .in('list_id', listIds);

    if (error) {
      return {
        data: null,
        error,
      };
    }

    shoppingItems = data || [];
  }

  return {
    data: {
      exported_at: new Date().toISOString(),

      user: {
        id: user.id,
        email: user.email,
      },

      profiles: profileResult.data,
      tasks: tasksResult.data || [],
      reminders: remindersResult.data || [],
      expenses: expensesResult.data || [],
      notes: notesResult.data || [],
      shopping_lists: shoppingLists,
      shopping_items: shoppingItems,
    },

    error: null,
  };
}

// ---------------- DELETE MY ACCOUNT ----------------

export async function deleteMyAccount() {
  return await supabase.rpc('delete_my_account');
}