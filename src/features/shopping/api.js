import { supabase } from '../../lib/supabase';

// Get shopping lists
export async function getShoppingLists(userId) {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Create a shopping list
export async function createShoppingList(userId, name) {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert({
      user_id: userId,
      name,
    })
    .select()
    .single();

  return { data, error };
}

// Get items inside a shopping list
export async function getShoppingItems(listId) {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true });

  return { data, error };
}

// Add a shopping item
export async function createShoppingItem(listId, name, quantity = 1) {
  const { data, error } = await supabase
    .from('shopping_items')
    .insert({
      list_id: listId,
      name,
      quantity,
    })
    .select()
    .single();

  return { data, error };
}

// Mark item as purchased/unpurchased
export async function updateShoppingItem(itemId, isPurchased) {
  const { data, error } = await supabase
    .from('shopping_items')
    .update({
      is_purchased: isPurchased,
    })
    .eq('id', itemId)
    .select()
    .single();

  return { data, error };
}

// Delete shopping item
export async function deleteShoppingItem(itemId) {
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('id', itemId);

  return { error };
}

// Delete shopping list
export async function deleteShoppingList(listId) {
  const { error } = await supabase
    .from('shopping_lists')
    .delete()
    .eq('id', listId);

  return { error };
}