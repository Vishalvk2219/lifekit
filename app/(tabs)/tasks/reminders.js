import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

import Screen from '../../../src/components/Screen';
import Button from '../../../src/components/Button';
import Input from '../../../src/components/Input';

import { getCurrentUserId } from '../../../src/features/tasks/api';
import {
  getReminders,
  createReminder,
  deleteReminder,
} from '../../../src/features/tasks/reminders-api';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [remindAt, setRemindAt] = useState(new Date());
  const [repeatRule, setRepeatRule] = useState('none');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const loadReminders = async () => {
    setLoading(true);
    setError('');

    const userResult = await getCurrentUserId();

    if (userResult.error || !userResult.userId) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    const result = await getReminders(userResult.userId);

    if (result.error) {
      setError(result.error.message);
    } else {
      setReminders(result.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadReminders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  const saveReminder = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('Reminder title is required.');
      return;
    }

    if (trimmedTitle.length > 120) {
      setValidationError(
        'Reminder title must be 120 characters or less.'
      );
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

    const result = await createReminder(userResult.userId, {
      title: trimmedTitle,
      remind_at: remindAt.toISOString(),
      repeat_rule: repeatRule,
    });

    setSaving(false);

    if (result.error) {
      Alert.alert(
        'Could not create reminder',
        result.error.message
      );
      return;
    }

    setTitle('');
    setRepeatRule('none');
    setRemindAt(new Date());

    loadReminders();
  };

  const handleDelete = (reminder) => {
    Alert.alert(
      'Delete reminder',
      `Delete "${reminder.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const userResult = await getCurrentUserId();

            if (
              userResult.error ||
              !userResult.userId
            ) {
              Alert.alert(
                'Error',
                'You must be logged in.'
              );
              return;
            }

            const result = await deleteReminder(
              reminder.id,
              userResult.userId
            );

            if (result.error) {
              Alert.alert(
                'Error',
                result.error.message
              );
              return;
            }

            setReminders((current) =>
              current.filter(
                (item) => item.id !== reminder.id
              )
            );
          },
        },
      ]
    );
  };

  const updateDate = (_, selectedDate) => {
    setShowDatePicker(false);

    if (!selectedDate) {
      return;
    }

    const nextDate = new Date(remindAt);

    nextDate.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    setRemindAt(nextDate);
  };

  const updateTime = (_, selectedDate) => {
    setShowTimePicker(false);

    if (!selectedDate) {
      return;
    }

    const nextDate = new Date(remindAt);

    nextDate.setHours(
      selectedDate.getHours(),
      selectedDate.getMinutes(),
      0,
      0
    );

    setRemindAt(nextDate);
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
          Reminders
        </Text>

        <Button
          title="Back to Tasks"
          onPress={() => router.back()}
        />

        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Reminder title"
        />

        {validationError ? (
          <Text>{validationError}</Text>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <Button
            title="Choose Date"
            onPress={() => setShowDatePicker(true)}
          />

          <Button
            title="Choose Time"
            onPress={() => setShowTimePicker(true)}
          />

          <Text>
            {format(
              remindAt,
              'dd MMM yyyy, h:mm a'
            )}
          </Text>
        </View>

        <Text style={{ marginTop: 16 }}>
          Repeat
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {['none', 'daily', 'weekly'].map(
            (item) => (
              <Button
                key={item}
                title={
                  repeatRule === item
                    ? `${item} ✓`
                    : item
                }
                onPress={() =>
                  setRepeatRule(item)
                }
              />
            )
          )}
        </View>

        {showDatePicker ? (
          <DateTimePicker
            value={remindAt}
            mode="date"
            onChange={updateDate}
          />
        ) : null}

        {showTimePicker ? (
          <DateTimePicker
            value={remindAt}
            mode="time"
            onChange={updateTime}
          />
        ) : null}

        <View style={{ marginTop: 16 }}>
          <Button
            title={
              saving
                ? 'Saving...'
                : 'Add Reminder'
            }
            onPress={saveReminder}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Your Reminders
          </Text>

          {loading ? (
            <Text>Loading reminders...</Text>
          ) : null}

          {!loading && error ? (
            <View>
              <Text>Error: {error}</Text>
              <Button
                title="Retry"
                onPress={loadReminders}
              />
            </View>
          ) : null}

          {!loading &&
          !error &&
          reminders.length === 0 ? (
            <Text>No reminders yet.</Text>
          ) : null}

          {!loading &&
            !error &&
            reminders.map((reminder) => (
              <View
                key={reminder.id}
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {reminder.title}
                </Text>

                <Text>
                  {format(
                    new Date(reminder.remind_at),
                    'dd MMM yyyy, h:mm a'
                  )}
                </Text>

                <Text>
                  Repeat: {reminder.repeat_rule}
                </Text>

                <Button
                  title="Delete"
                  onPress={() =>
                    handleDelete(reminder)
                  }
                />
              </View>
            ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
