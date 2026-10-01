import { supabase } from '../../lib/supabase';

export async function getNotes(userId) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  return { data, error };
}

export async function searchNotes(userId, searchText) {
  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  if (searchText?.trim()) {
    const search = searchText.trim().replace(/[%_]/g, '\\$&');

    query = query.or(
      `title.ilike.%${search}%,body.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  return { data, error };
}

export async function getNote(noteId) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single();

  return { data, error };
}

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
      title: title.trim(),
      body: body.trim(),
      is_pinned: false,
    })
    .select()
    .single();

  return { data, error };
}

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

export async function deleteNote(noteId) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);

  return { error };
}

// Week 11 Dashboard summary
export async function getSummary(userId) {
  const { data, error } = await supabase
    .from('notes')
    .select('id, is_pinned')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const notes = data || [];

  const pinned = notes.filter(
    (note) => note.is_pinned
  ).length;

  return {
    title: 'Notes',
    value: String(notes.length),
    caption: `${pinned} pinned`,
    href: '/(tabs)/notes',
  };
}