import { supabase } from '../../lib/supabase';

export async function getReminders(userId) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('remind_at', { ascending: true });

  return { data, error };
}

export async function getReminder(reminderId, userId) {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('id', reminderId)
    .eq('user_id', userId)
    .single();

  return { data, error };
}

export async function createReminder(userId, reminder) {
  const { data, error } = await supabase
    .from('reminders')
    .insert({
      user_id: userId,
      title: reminder.title,
      remind_at: reminder.remind_at,
      repeat_rule: reminder.repeat_rule || 'none',
      notification_id: reminder.notification_id || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateReminder(reminderId, userId, updates) {
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', reminderId)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
}

export async function deleteReminder(reminderId, userId) {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId)
    .eq('user_id', userId);

  return { error };
}
