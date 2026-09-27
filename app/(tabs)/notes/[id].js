import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import {
  getNote,
  updateNote,
} from '../../../src/features/notes/api';

export default function NoteDetails() {
  const { id } = useLocalSearchParams();

  const [note, setNote] = useState(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNote();
  }, [id]);

  async function loadNote() {
    setLoading(true);
    setError('');

    const { data, error } = await getNote(id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setNote(data);
    setTitle(data.title);
    setBody(data.body);
    setIsPinned(data.is_pinned);
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }

    if (!body.trim()) {
      Alert.alert('Validation', 'Note body is required.');
      return;
    }

    setSaving(true);

    const { data, error } = await updateNote(
      id,
      title,
      body,
      isPinned
    );

    setSaving(false);

    if (error) {
      Alert.alert('Update Failed', error.message);
      return;
    }

    setNote(data);

    Alert.alert('Success', 'Note updated successfully.');
    router.back();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <Pressable
          style={styles.button}
          onPress={loadNote}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.center}>
        <Text>Note not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Note</Text>

      <Text style={styles.label}>Title</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Note</Text>

      <TextInput
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.body]}
      />

      <Pressable
        style={styles.pinButton}
        onPress={() => setIsPinned(!isPinned)}
      >
        <Text>
          {isPinned ? '📌 Unpin Note' : '📌 Pin Note'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </Pressable>
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
    marginBottom: 25,
  },

  label: {
    fontWeight: 'bold',
    marginBottom: 7,
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },

  body: {
    height: 200,
  },

  pinButton: {
    backgroundColor: '#EEE',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
});