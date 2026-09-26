import { supabase } from "../../lib/supabase";

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
    throw new Error("You must be signed in to view expenses.");
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("spent_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Create one expense for the signed-in user.
 */
export async function createExpense({
  title,
  amount,
  category = "other",
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
    throw new Error("You must be signed in to add an expense.");
  }

  const numericAmount = Number(amount);

  if (!title?.trim()) {
    throw new Error("Expense title is required.");
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Expense amount must be greater than 0.");
  }

  const { data, error } = await supabase
    .from("expenses")
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

