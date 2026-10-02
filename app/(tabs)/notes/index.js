import { useCallback, useState } from 'react';
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
import { router, useFocusEffect } from 'expo-router';

import { useAuth } from '../../../src/context/AuthContext';

import {
  getNotes,
  searchNotes,
  deleteNote,
  toggleNotePin,
} from '../../../src/features/notes/api';

export default function Notes() {
  const { session } = useAuth();

  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotes = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const result = searchText.trim()
      ? await searchNotes(session.user.id, searchText)
      : await getNotes(session.user.id);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setNotes(result.data || []);
  }, [session?.user?.id, searchText]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  async function handleDelete(note) {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${note.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteNote(note.id);

            if (error) {
              Alert.alert(
                'Delete Failed',
                error.message
              );
              return;
            }

            setNotes((current) =>
              current.filter(
                (item) => item.id !== note.id
              )
            );
          },
        },
      ]
    );
  }

  async function handlePin(note) {
    const { data, error } = await toggleNotePin(
      note.id,
      !note.is_pinned
    );

    if (error) {
      Alert.alert(
        'Update Failed',
        error.message
      );
      return;
    }

    setNotes((current) =>
      current
        .map((item) =>
          item.id === note.id ? data : item
        )
        .sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) {
            return a.is_pinned ? -1 : 1;
          }

          return new Date(b.updated_at) -
            new Date(a.updated_at);
        })
    );
  }

  function handleSearch(text) {
    setSearchText(text);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>

      <View style={styles.topRow}>
        <TextInput
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search notes..."
          style={styles.searchInput}
        />

        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push('/(tabs)/notes/new')
          }
        >
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={styles.shoppingButton}
          onPress={() =>
            router.push('/(tabs)/notes/lists')
          }
        >
          <Text style={styles.shoppingText}>
            🛒 Shopping Lists
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Loading notes...
          </Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.center}>
          <Text style={styles.error}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadNotes}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!loading &&
      !error &&
      notes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>
            {searchText
              ? 'No matching notes'
              : 'No notes yet'}
          </Text>

          <Text style={styles.emptyText}>
            {searchText
              ? 'Try a different search.'
              : 'Create your first note.'}
          </Text>

          {!searchText ? (
            <Pressable
              style={styles.createButton}
              onPress={() =>
                router.push('/(tabs)/notes/new')
              }
            >
              <Text style={styles.createText}>
                Create Note
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {!loading &&
      !error &&
      notes.length > 0 ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadNotes}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                style={styles.noteContent}
                onPress={() =>
                  router.push(
                    `/(tabs)/notes/${item.id}`
                  )
                }
              >
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>
                    {item.is_pinned ? '📌 ' : ''}
                    {item.title}
                  </Text>
                </View>

                <Text
                  style={styles.noteBody}
                  numberOfLines={3}
                >
                  {item.body}
                </Text>
              </Pressable>

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() =>
                    handlePin(item)
                  }
                >
                  <Text style={styles.actionText}>
                    {item.is_pinned
                      ? 'Unpin'
                      : 'Pin'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    handleDelete(item)
                  }
                >
                  <Text style={styles.deleteText}>
                    Delete
                  </Text>
                </Pressable>
              </View>
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
    marginBottom: 18,
  },

  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  searchInput: {
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

  actionsRow: {
    marginBottom: 16,
  },

  shoppingButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  shoppingText: {
    fontWeight: 'bold',
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  noteContent: {
    marginBottom: 12,
  },

  noteHeader: {
    marginBottom: 8,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  noteBody: {
    color: '#666',
    lineHeight: 20,
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 18,
  },

  actionText: {
    fontWeight: 'bold',
  },

  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },

  center: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 10,
    color: '#777',
  },

  error: {
    color: 'red',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 15,
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
  },

  retryText: {
    color: 'white',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },

  createButton: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
  },

  createText: {
    color: 'white',
    fontWeight: 'bold',
  },
});