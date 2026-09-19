import { supabase } from '../../lib/supabase';

// Get all notes for the signed-in user
export async function getNotes(userId) {
  const { data, error } = await supabase 
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  return { data, error };
}

// Create one note
export async function createNote(userId, title, body) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      title,
      body,
    })
    .select()
    .single();

  return { data, error };
}

// Update a note
export async function updateNote(noteId, title, body, isPinned) {
  const { data, error } = await supabase
    .from('notes')
    .update({
      title,
      body,
      is_pinned: isPinned,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .select()
    .single();

  return { data, error };
}

// Delete a note
export async function deleteNote(noteId) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);

  return { error };
}