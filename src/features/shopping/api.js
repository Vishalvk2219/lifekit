import { supabase } from '../../lib/supabase';

// Get shopping lists
// Get all shopping lists
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
// Create shopping list
export async function createShoppingList(
  userId,
  name
) {
  if (!name?.trim()) {
    return {
      data: null,
      error: new Error('Shopping list name is required.'),
    };
  }

  const { data, error } = await supabase
    .from('shopping_lists')
    .insert({
      user_id: userId,
      name,
    })
      name: name.trim(),
    })
    .select()
    .single();

  return { data, error };
}

// Update shopping list
export async function updateShoppingList(
  listId,
  name
) {
  if (!name?.trim()) {
    return {
      data: null,
      error: new Error('Shopping list name is required.'),
    };
  }

  const { data, error } = await supabase
    .from('shopping_lists')
    .update({
      name: name.trim(),
    })
    .eq('id', listId)
    .select()
    .single();

  return { data, error };
}

// Get items inside a shopping list
// Delete shopping list
export async function deleteShoppingList(listId) {
  const { error } = await supabase
    .from('shopping_lists')
    .delete()
    .eq('id', listId);

  return { error };
}

// Get items
export async function getShoppingItems(listId) {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('list_id', listId)
    .order('is_purchased', { ascending: true })
    .order('created_at', { ascending: true });

  return { data, error };
}

// Add a shopping item
export async function createShoppingItem(listId, name, quantity = 1) {
// Add item
export async function createShoppingItem(
  listId,
  name,
  quantity
) {
  if (!name?.trim()) {
    return {
      data: null,
      error: new Error('Item name is required.'),
    };
  }

  const numericQuantity = Number(quantity);

  if (
    !Number.isInteger(numericQuantity) ||
    numericQuantity <= 0
  ) {
    return {
      data: null,
      error: new Error(
        'Quantity must be a positive whole number.'
      ),
    };
  }

  const { data, error } = await supabase
    .from('shopping_items')
    .insert({
      list_id: listId,
      name,
      quantity,
      name: name.trim(),
      quantity: numericQuantity,
      is_purchased: false,
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
// Update item
export async function updateShoppingItem(
  itemId,
  name,
  quantity,
  isPurchased
) {
  if (!name?.trim()) {
    return {
      data: null,
      error: new Error('Item name is required.'),
    };
  }

  const numericQuantity = Number(quantity);

  if (
    !Number.isInteger(numericQuantity) ||
    numericQuantity <= 0
  ) {
    return {
      data: null,
      error: new Error(
        'Quantity must be a positive whole number.'
      ),
    };
  }

  const { data, error } = await supabase
    .from('shopping_items')
    .update({
      name: name.trim(),
      quantity: numericQuantity,
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
// Mark purchased/unpurchased
export async function toggleShoppingItem(
  itemId,
  isPurchased
) {
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

// Delete item
export async function deleteShoppingItem(itemId) {
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('id', itemId);

  return { error };
}