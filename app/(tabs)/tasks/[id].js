import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import Screen from '../../../src/components/Screen';
import Button from '../../../src/components/Button';
import Input from '../../../src/components/Input';

import {
  getCurrentUserId,
  getTask,
  updateTask,
} from '../../../src/features/tasks/api';

export default function EditTask() {
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueAt, setDueAt] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    setLoading(true);
    setError('');

    const userResult = await getCurrentUserId();

    if (userResult.error || !userResult.userId) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    const result = await getTask(id, userResult.userId);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    const task = result.data;

    setTitle(task.title);
    setNotes(task.notes || '');
    setPriority(task.priority);
    setCategory(task.category);
    setDueAt(task.due_at ? new Date(task.due_at) : null);

    setLoading(false);
  };

  const saveChanges = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('Title is required.');
      return;
    }

    if (trimmedTitle.length > 120) {
      setValidationError('Title must be 120 characters or less.');
      return;
    }

    setValidationError('');
    setSaving(true);

    const userResult = await getCurrentUserId();

    if (userResult.error || !userResult.userId) {
      setSaving(false);
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    const result = await updateTask(id, userResult.userId, {
      title: trimmedTitle,
      notes: notes.trim() || null,
      priority,
      category: category.trim() || 'general',
      due_at: dueAt ? dueAt.toISOString() : null,
    });

    setSaving(false);

    if (result.error) {
      Alert.alert('Could not update task', result.error.message);
      return;
    }

    router.back();
  };

  const updateDate = (_, selectedDate) => {
    setShowDatePicker(false);

    if (!selectedDate) {
      return;
    }

    const nextDate = dueAt ? new Date(dueAt) : new Date();

    nextDate.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    setDueAt(nextDate);
  };

  const updateTime = (_, selectedDate) => {
    setShowTimePicker(false);

    if (!selectedDate) {
      return;
    }

    const nextDate = dueAt ? new Date(dueAt) : new Date();

    nextDate.setHours(
      selectedDate.getHours(),
      selectedDate.getMinutes(),
      0,
      0
    );

    setDueAt(nextDate);
  };

  if (loading) {
    return (
      <Screen>
        <Text>Loading task...</Text>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={loadTask} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 16,
          }}
        >
          Edit Task
        </Text>

        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
        />

        {validationError ? (
          <Text>{validationError}</Text>
        ) : null}

        <View style={{ marginTop: 12 }}>
          <Input
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Input
            value={category}
            onChangeText={setCategory}
            placeholder="Category"
          />
        </View>

        <Text style={{ marginTop: 16 }}>Priority</Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 8,
          }}
        >
          {['low', 'medium', 'high'].map((item) => (
            <Button
              key={item}
              title={
                priority === item
                  ? `${item} ✓`
                  : item
              }
              onPress={() => setPriority(item)}
            />
          ))}
        </View>

        <View style={{ marginTop: 16 }}>
          <Button
            title="Choose Due Date"
            onPress={() => setShowDatePicker(true)}
          />

          <Button
            title="Choose Due Time"
            onPress={() => setShowTimePicker(true)}
          />

          <Text>
            {dueAt
              ? `Due: ${dueAt.toLocaleString()}`
              : 'No due date'}
          </Text>
        </View>

        {showDatePicker ? (
          <DateTimePicker
            value={dueAt || new Date()}
            mode="date"
            onChange={updateDate}
          />
        ) : null}

        {showTimePicker ? (
          <DateTimePicker
            value={dueAt || new Date()}
            mode="time"
            onChange={updateTime}
          />
        ) : null}

        <View style={{ marginTop: 20 }}>
          <Button
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={saveChanges}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
