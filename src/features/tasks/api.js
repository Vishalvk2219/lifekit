import { supabase } from '../../lib/supabase';

export async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    userId: user?.id ?? null,
    error,
  };
}

export async function getTasks(userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getTask(taskId, userId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', userId)
    .single();

  return { data, error };
}

export async function createTask(userId, task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: task.title,
      notes: task.notes || null,
      priority: task.priority || 'medium',
      category: task.category || 'general',
      due_at: task.due_at || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateTask(taskId, userId, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
}

export async function deleteTask(taskId, userId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId);

  return { error };
}

export async function toggleTask(taskId, userId, isDone) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ is_done: isDone })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
}

export async function getSummary(userId) {
  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, due_at, is_done')
    .eq('user_id', userId)
    .gte('due_at', startOfToday.toISOString())
    .lt('due_at', endOfToday.toISOString())
    .order('due_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const tasks = data || [];

  const completed = tasks.filter(
    (task) => task.is_done
  ).length;

  const remaining = tasks.length - completed;

  return {
    title: 'Tasks',
    value: `${remaining} due`,
    caption: `${completed} completed today`,
    href: '/(tabs)/tasks',
  };
}