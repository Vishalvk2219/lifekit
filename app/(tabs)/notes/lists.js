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
import { router } from 'expo-router';

import { useAuth } from '../../../src/context/AuthContext';

import {
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
} from '../../../src/features/shopping/api';

export default function ShoppingLists() {
  const { session } = useAuth();

  const [lists, setLists] = useState([]);
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLists();
  }, [session?.user?.id]);

  async function loadLists() {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } =
      await getShoppingLists(session.user.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setLists(data || []);
  }

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert(
        'Validation',
        'Please enter a list name.'
      );
      return;
    }

    if (!session?.user?.id) {
      Alert.alert('Error', 'You are not signed in.');
      return;
    }

    setSaving(true);

    const { data, error } =
      await createShoppingList(
        session.user.id,
        name
      );

    setSaving(false);

    if (error) {
      Alert.alert('Create Failed', error.message);
      return;
    }

    setLists((current) => [data, ...current]);
    setName('');
  }

  function handleDelete(listId) {
    Alert.alert(
      'Delete List',
      'Delete this shopping list and its items?',
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
              await deleteShoppingList(listId);

            if (error) {
              Alert.alert(
                'Delete Failed',
                error.message
              );
              return;
            }

            setLists((current) =>
              current.filter(
                (item) => item.id !== listId
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
        Shopping Lists
      </Text>

      <Text style={styles.subtitle}>
        Manage your shopping lists
      </Text>

      <View style={styles.createRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="New list name"
          style={styles.input}
        />

        <Pressable
          style={styles.addButton}
          onPress={handleCreate}
          disabled={saving}
        >
          <Text style={styles.addText}>
            +
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
            onPress={loadLists}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error && lists.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>
            No shopping lists
          </Text>

          <Text style={styles.emptyText}>
            Create your first list above.
          </Text>
        </View>
      ) : null}

      {!loading && !error && lists.length > 0 ? (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadLists}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                style={styles.listContent}
                onPress={() =>
                  router.push(
                    `/(tabs)/notes/list/${item.id}`
                  )
                }
              >
                <Text style={styles.listName}>
                  {item.name}
                </Text>

                <Text style={styles.open}>
                  Open list →
                </Text>
              </Pressable>

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
  },

  subtitle: {
    color: '#777',
    marginBottom: 20,
  },

  createRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
  },

  addButton: {
    width: 52,
    backgroundColor: '#222',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
    color: 'white',
    fontSize: 28,
  },

  loader: {
    marginTop: 30,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  listContent: {
    flex: 1,
  },

  listName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  open: {
    color: '#777',
    marginTop: 5,
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