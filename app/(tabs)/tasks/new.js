import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import Screen from '../../../src/components/Screen';
import Button from '../../../src/components/Button';
import Input from '../../../src/components/Input';

import {
  createTask,
  getCurrentUserId,
} from '../../../src/features/tasks/api';

export default function NewTask() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueAt, setDueAt] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const saveTask = async () => {
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

    const result = await createTask(userResult.userId, {
      title: trimmedTitle,
      notes: notes.trim(),
      priority,
      category: category.trim() || 'general',
      due_at: dueAt ? dueAt.toISOString() : null,
    });

    setSaving(false);

    if (result.error) {
      Alert.alert('Could not create task', result.error.message);
      return;
    }

    router.replace('/(tabs)/tasks');
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
          New Task
        </Text>

        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
        />

        {validationError ? (
          <Text style={{ marginTop: 4 }}>
            {validationError}
          </Text>
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

          {dueAt ? (
            <Text>
              Due: {dueAt.toLocaleString()}
            </Text>
          ) : (
            <Text>No due date</Text>
          )}
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
            title={saving ? 'Saving...' : 'Create Task'}
            onPress={saveTask}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
