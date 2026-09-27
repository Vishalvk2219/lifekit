import { supabase } from '../../lib/supabase';

// Get all notes for the signed-in user
export async function getNotes(userId) {
  const { data, error } = await supabase 
// Get all notes
export async function getNotes(userId) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  return { data, error };
}

// Search notes by title or body
export async function searchNotes(userId, searchText) {
  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  return { data, error };
}

// Create one note
export async function createNote(userId, title, body) {
  if (searchText?.trim()) {
    const search = searchText.trim();

    query = query.or(
      `title.ilike.%${search}%,body.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  return { data, error };
}

// Get one note
export async function getNote(noteId) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single();

  return { data, error };
}

// Create a note
export async function createNote(userId, title, body) {
  if (!title?.trim()) {
    return {
      data: null,
      error: new Error('Note title is required.'),
    };
  }

  if (!body?.trim()) {
    return {
      data: null,
      error: new Error('Note body is required.'),
    };
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      title,
      body,
      title: title.trim(),
      body: body.trim(),
      is_pinned: false,
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
export async function updateNote(
  noteId,
  title,
  body,
  isPinned
) {
  if (!title?.trim()) {
    return {
      data: null,
      error: new Error('Note title is required.'),
    };
  }

  if (!body?.trim()) {
    return {
      data: null,
      error: new Error('Note body is required.'),
    };
  }

  const { data, error } = await supabase
    .from('notes')
    .update({
      title: title.trim(),
      body: body.trim(),
      is_pinned: isPinned,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .select()
    .single();

  return { data, error };
}

// Pin or unpin a note
export async function toggleNotePin(noteId, isPinned) {
  const { data, error } = await supabase
    .from('notes')
    .update({
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