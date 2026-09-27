import { supabase } from '../../lib/supabase';

/**
 * Get all expenses for the signed-in user.
 */
export async function getExpenses() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('You must be signed in to view expenses.');
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('spent_on', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get one expense by id.
 */
export async function getExpenseById(id) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('You must be signed in.');
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Create an expense.
 */
export async function createExpense({
  title,
  amount,
  category = 'other',
  spentOn,
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('You must be signed in to add an expense.');
  }

  const numericAmount = Number(amount);

  if (!title?.trim()) {
    throw new Error('Expense title is required.');
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Expense amount must be greater than 0.');
  }

  if (!spentOn) {
    throw new Error('Expense date is required.');
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: user.id,
      title: title.trim(),
      amount: numericAmount,
      category,
      spent_on: spentOn,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update an expense.
 */
export async function updateExpense(
  id,
  { title, amount, category, spentOn }
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('You must be signed in to update an expense.');
  }

  const numericAmount = Number(amount);

  if (!title?.trim()) {
    throw new Error('Expense title is required.');
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Expense amount must be greater than 0.');
  }

  if (!spentOn) {
    throw new Error('Expense date is required.');
  }

  const { data, error } = await supabase
    .from('expenses')
    .update({
      title: title.trim(),
      amount: numericAmount,
      category,
      spent_on: spentOn,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Delete an expense.
 */
export async function deleteExpense(id) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('You must be signed in to delete an expense.');
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}