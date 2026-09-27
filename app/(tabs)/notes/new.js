import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '../../../src/context/AuthContext';
import { createNote } from '../../../src/features/notes/api';

export default function NewNote() {
  const { session } = useAuth();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a note title.');
      return;
    }

    if (!body.trim()) {
      Alert.alert('Validation', 'Please enter note content.');
      return;
    }

    if (!session?.user?.id) {
      Alert.alert('Error', 'You are not signed in.');
      return;
    }

    setSaving(true);

    const { data, error } = await createNote(
      session.user.id,
      title,
      body
    );

    setSaving(false);

    if (error) {
      Alert.alert('Create Failed', error.message);
      return;
    }

    router.replace(`/(tabs)/notes/${data.id}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Note</Text>

      <Text style={styles.label}>Title</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter note title"
        style={styles.input}
      />

      <Text style={styles.label}>Note</Text>

      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Write your note..."
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.body]}
      />

      <Pressable
        style={styles.button}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Saving...' : 'Save Note'}
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
    height: 180,
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
});