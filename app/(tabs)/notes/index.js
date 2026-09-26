import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import {
  createNote,
  getNotes,
} from '../../../src/features/notes/api';

export default function Notes() {
  const { session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  const handleCreateNote = async () => {
    if (!session?.user?.id) {
      Alert.alert('Error', 'You are not logged in.');
      return;
    }

    setLoading(true);

    const { data, error } = await createNote(
      session.user.id,
      'Week 9 Test Note',
      'This note proves that my Notes module can write to Supabase.'
    );

    setLoading(false);

    if (error) {
      Alert.alert('Create Note Failed', error.message);
      return;
    }

    Alert.alert('Success', 'Note created successfully.');
    setNotes((current) => [data, ...current]);
  };

  const handleLoadNotes = async () => {
    if (!session?.user?.id) {
      Alert.alert('Error', 'You are not logged in.');
      return;
    }

    setLoading(true);

    const { data, error } = await getNotes(session.user.id);

    setLoading(false);

    if (error) {
      Alert.alert('Load Notes Failed', error.message);
      return;
    }

    setNotes(data || []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>

      <Text style={styles.subtitle}>
        Week 9 Supabase Test
      </Text>

      <Pressable
        style={styles.button}
        onPress={handleCreateNote}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Please wait...' : 'Create Test Note'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={handleLoadNotes}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>
          Load My Notes
        </Text>
      </Pressable>

      <Text style={styles.heading}>My Notes</Text>

      {notes.map((note) => (
        <View style={styles.noteCard} key={note.id}>
          <Text style={styles.noteTitle}>
            {note.title}
          </Text>

          <Text style={styles.noteBody}>
            {note.body}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FB',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
  },

  subtitle: {
    color: '#777',
    marginTop: 5,
    marginBottom: 25,
  },

  button: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },

  secondaryButtonText: {
    color: '#222',
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 12,
  },

  noteCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  noteTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  noteBody: {
    marginTop: 6,
    color: '#666',
  },
});