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
  if (!id) {
    throw new Error('Expense ID is missing.');
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('Please sign in before deleting an expense.');
  }

  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id');

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      'No expense was deleted. Check that the expense exists and your Supabase DELETE policy allows this action.'
    );
  }

  return true;
}

/**
 * Return the start of this month and the start of next month.
 * The upper bound is exclusive so future months are not accidentally included.
 */
function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth();

  const start = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
  const nextMonthDate = new Date(year, monthIndex + 1, 1);
  const end = `${nextMonthDate.getFullYear()}-${String(
    nextMonthDate.getMonth() + 1
  ).padStart(2, '0')}-01`;

  return { start, end };
}

/**
 * Get this month's spending total for a specific user.
 */
export async function getMonthlyTotal(userId) {
  if (!userId) {
    throw new Error('A signed-in user is required to load the monthly total.');
  }

  const { start, end } = getCurrentMonthRange();

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('spent_on', start)
    .lt('spent_on', end);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
}

/**
 * Get this month's spending breakdown by category for a specific user.
 */
export async function getCategoryBreakdown(userId) {
  if (!userId) {
    throw new Error('A signed-in user is required to load the spending breakdown.');
  }

  const { start, end } = getCurrentMonthRange();

  const { data, error } = await supabase
    .from('expenses')
    .select('category, amount')
    .eq('user_id', userId)
    .gte('spent_on', start)
    .lt('spent_on', end);

  if (error) {
    throw new Error(error.message);
  }

  const totals = {};

  (data || []).forEach((expense) => {
    const category = expense.category || 'other';
    totals[category] = (totals[category] || 0) + Number(expense.amount);
  });

  return Object.entries(totals).map(([category, amount]) => ({
    category,
    amount,
  }));
}

/**
 * Dashboard summary for Money.
 */
export async function getSummary(userId) {
  const total = await getMonthlyTotal(userId);

  return {
    title: 'Money',
    value: `₹${total.toFixed(2)}`,
    caption: 'this month',
    href: '/(tabs)/money',
  };
} 