import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import {
  getShoppingItems,
  createShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
} from '../../../../src/features/shopping/api';

export default function ShoppingListDetail() {
  const { id } = useLocalSearchParams();

  const [items, setItems] = useState([]);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, [id]);

  async function loadItems() {
    setLoading(true);
    setError('');

    const { data, error } =
      await getShoppingItems(id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setItems(data || []);
  }

  async function handleAdd() {
    if (!name.trim()) {
      Alert.alert(
        'Validation',
        'Please enter an item name.'
      );
      return;
    }

    const numericQuantity = Number(quantity);

    if (
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      Alert.alert(
        'Validation',
        'Quantity must be a positive whole number.'
      );
      return;
    }

    setSaving(true);

    const { data, error } =
      await createShoppingItem(
        id,
        name,
        numericQuantity
      );

    setSaving(false);

    if (error) {
      Alert.alert(
        'Add Item Failed',
        error.message
      );
      return;
    }

    setItems((current) => [...current, data]);

    setName('');
    setQuantity('1');
  }

  async function handleToggle(item) {
    const { data, error } =
      await toggleShoppingItem(
        item.id,
        !item.is_purchased
      );

    if (error) {
      Alert.alert(
        'Update Failed',
        error.message
      );
      return;
    }

    setItems((current) =>
      current.map((existing) =>
        existing.id === item.id
          ? data
          : existing
      )
    );
  }

  function handleDelete(itemId) {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } =
              await deleteShoppingItem(itemId);

            if (error) {
              Alert.alert(
                'Delete Failed',
                error.message
              );
              return;
            }

            setItems((current) =>
              current.filter(
                (item) => item.id !== itemId
              )
            );
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Shopping Items
      </Text>

      <View style={styles.addCard}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Item name"
          style={styles.input}
        />

        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantity"
          keyboardType="numeric"
          style={styles.quantity}
        />

        <Pressable
          style={styles.addButton}
          onPress={handleAdd}
          disabled={saving}
        >
          <Text style={styles.addText}>
            {saving ? '...' : 'Add'}
          </Text>
        </Pressable>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loader}
        />
      )}

      {!loading && error ? (
        <View style={styles.center}>
          <Text style={styles.error}>
            {error}
          </Text>

          <Pressable
            style={styles.retry}
            onPress={loadItems}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>
            No items
          </Text>

          <Text style={styles.emptyText}>
            Add your first shopping item above.
          </Text>
        </View>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadItems}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Pressable
                style={styles.check}
                onPress={() =>
                  handleToggle(item)
                }
              >
                <Text style={styles.checkText}>
                  {item.is_purchased ? '✓' : '○'}
                </Text>
              </Pressable>

              <View style={styles.itemInfo}>
                <Text
                  style={[
                    styles.itemName,
                    item.is_purchased &&
                      styles.purchased,
                  ]}
                >
                  {item.name}
                </Text>

                <Text style={styles.quantityText}>
                  Quantity: {item.quantity}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  handleDelete(item.id)
                }
              >
                <Text style={styles.delete}>
                  Delete
                </Text>
              </Pressable>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 20,
  },

  addCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  quantity: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  addText: {
    color: 'white',
    fontWeight: 'bold',
  },

  loader: {
    marginTop: 30,
  },

  list: {
    paddingBottom: 30,
  },

  item: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  check: {
    marginRight: 12,
  },

  checkText: {
    fontSize: 28,
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  purchased: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  quantityText: {
    color: '#777',
    marginTop: 4,
  },

  delete: {
    color: 'red',
    marginLeft: 10,
  },

  center: {
    alignItems: 'center',
    marginTop: 40,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#777',
    marginTop: 5,
  },

  error: {
    color: 'red',
    textAlign: 'center',
  },

  retry: {
    marginTop: 15,
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
  },

  retryText: {
    color: 'white',
  },
});