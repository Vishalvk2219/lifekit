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
  getNotes,
  searchNotes,
  deleteNote,
  toggleNotePin,
} from '../../../src/features/notes/api';

export default function Notes() {
  const { session } = useAuth();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session?.user?.id) {
        loadNotes(search);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, session?.user?.id]);

  async function loadNotes(searchText = '') {
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
  }

  async function handleDelete(noteId) {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteNote(noteId);

            if (error) {
              Alert.alert('Delete Failed', error.message);
              return;
            }

            setNotes((current) =>
              current.filter((note) => note.id !== noteId)
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
      Alert.alert('Update Failed', error.message);
      return;
    }

    setNotes((current) =>
      current
        .map((item) =>
          item.id === note.id ? data : item
        )
        .sort(
          (a, b) =>
            Number(b.is_pinned) - Number(a.is_pinned)
        )
    );
  }

  function renderNote({ item }) {
    return (
      <View style={styles.card}>
        <Pressable
          onPress={() =>
            router.push(`/(tabs)/notes/${item.id}`)
          }
        >
          <View style={styles.titleRow}>
            <Text style={styles.noteTitle}>
              {item.title}
            </Text>

            {item.is_pinned && (
              <Text style={styles.pin}>📌</Text>
            )}
          </View>

          <Text
            style={styles.noteBody}
            numberOfLines={3}
          >
            {item.body}
          </Text>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            onPress={() => handlePin(item)}
            style={styles.smallButton}
          >
            <Text>
              {item.is_pinned ? 'Unpin' : 'Pin'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push(`/(tabs)/notes/${item.id}`)
            }
            style={styles.smallButton}
          >
            <Text>Edit</Text>
          </Pressable>

          <Pressable
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>

      <Text style={styles.subtitle}>
        Write and organize your notes
      </Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search title or body..."
        style={styles.search}
      />
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

      <Pressable
        style={styles.createButton}
        onPress={() =>
          router.push('/(tabs)/notes/new')
        }
      >
        <Text style={styles.createText}>
          + Create Note
        </Text>
      </Pressable>

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
            style={styles.retryButton}
            onPress={() => loadNotes(search)}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error && notes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>
            No notes yet
          </Text>

          <Text style={styles.emptyText}>
            Create your first note.
          </Text>
        </View>
      ) : null}

      {!loading && !error && notes.length > 0 ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={() => loadNotes(search)}
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

  shoppingButton: {
  backgroundColor: '#EDEDED',
  padding: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 10,
},

shoppingText: {
  fontWeight: 'bold',
},

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
  },

  subtitle: {
    color: '#777',
    marginBottom: 18,
  },

  search: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  createButton: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },

  createText: {
    color: 'white',
    fontWeight: 'bold',
  },

  loader: {
    marginTop: 30,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },

  pin: {
    marginLeft: 8,
  },

  noteBody: {
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 8,
  },

  smallButton: {
    backgroundColor: '#EEE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  deleteButton: {
    backgroundColor: '#FFE5E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  deleteText: {
    color: 'red',
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

  retryButton: {
    marginTop: 15,
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
  },

  retryText: {
    color: 'white',
  },
});