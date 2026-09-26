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
  const { data, error } = await supabase
    .from('tasks')
    .select('is_done')
    .eq('user_id', userId);

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const total = data.length;
  const completed = data.filter((task) => task.is_done).length;

  return {
    data: {
      title: 'Tasks',
      value: String(total),
      caption: `${completed} completed`,
      href: '/(tabs)/tasks',
    },
    error: null,
  };
}