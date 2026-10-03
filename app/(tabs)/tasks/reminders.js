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
  updateReminder,
  deleteReminder,
} from '../../../src/features/tasks/reminders-api';

import {
  scheduleReminderNotification,
  cancelReminderNotification,
} from '../../../src/features/tasks/notifications';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);

  const [title, setTitle] = useState('');
  const [remindAt, setRemindAt] = useState(new Date());
  const [repeatRule, setRepeatRule] = useState('none');

  const [editingReminderId, setEditingReminderId] =
    useState(null);

  const [showDatePicker, setShowDatePicker] =
    useState(false);
  const [showTimePicker, setShowTimePicker] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] =
    useState('');

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

  const resetForm = () => {
    setTitle('');
    setRepeatRule('none');
    setRemindAt(new Date());
    setEditingReminderId(null);
    setValidationError('');
  };

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

    if (remindAt <= new Date()) {
      setValidationError(
        'Reminder date and time must be in the future.'
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

    const remindAtIso = remindAt.toISOString();

    if (editingReminderId) {
      const existingReminder = reminders.find(
        (item) => item.id === editingReminderId
      );

      if (!existingReminder) {
        setSaving(false);
        Alert.alert(
          'Error',
          'The reminder could not be found.'
        );
        return;
      }

      const notificationResult =
        await scheduleReminderNotification({
          title: trimmedTitle,
          remindAt: remindAtIso,
          repeatRule,
        });

      if (
        notificationResult.error ||
        !notificationResult.notificationId
      ) {
        setSaving(false);
        Alert.alert(
          'Could not schedule notification',
          notificationResult.error?.message ||
            'Notification could not be scheduled.'
        );
        return;
      }

      const result = await updateReminder(
        editingReminderId,
        userResult.userId,
        {
          title: trimmedTitle,
          remind_at: remindAtIso,
          repeat_rule: repeatRule,
          notification_id:
            notificationResult.notificationId,
        }
      );

      if (result.error) {
        await cancelReminderNotification(
          notificationResult.notificationId
        );

        setSaving(false);

        Alert.alert(
          'Could not update reminder',
          result.error.message
        );
        return;
      }

      if (existingReminder.notification_id) {
        await cancelReminderNotification(
          existingReminder.notification_id
        );
      }

      setSaving(false);
      resetForm();
      loadReminders();
      return;
    }

    const notificationResult =
      await scheduleReminderNotification({
        title: trimmedTitle,
        remindAt: remindAtIso,
        repeatRule,
      });

    if (
      notificationResult.error ||
      !notificationResult.notificationId
    ) {
      setSaving(false);
      Alert.alert(
        'Could not schedule notification',
        notificationResult.error?.message ||
          'Notification could not be scheduled.'
      );
      return;
    }

    const result = await createReminder(
      userResult.userId,
      {
        title: trimmedTitle,
        remind_at: remindAtIso,
        repeat_rule: repeatRule,
        notification_id:
          notificationResult.notificationId,
      }
    );

    if (result.error) {
      await cancelReminderNotification(
        notificationResult.notificationId
      );

      setSaving(false);

      Alert.alert(
        'Could not create reminder',
        result.error.message
      );
      return;
    }

    setSaving(false);
    resetForm();
    loadReminders();
  };

  const startEditing = (reminder) => {
    setEditingReminderId(reminder.id);
    setTitle(reminder.title);
    setRemindAt(new Date(reminder.remind_at));
    setRepeatRule(reminder.repeat_rule || 'none');
    setValidationError('');
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

            if (reminder.notification_id) {
              await cancelReminderNotification(
                reminder.notification_id
              );
            }

            setReminders((current) =>
              current.filter(
                (item) => item.id !== reminder.id
              )
            );

            if (
              editingReminderId === reminder.id
            ) {
              resetForm();
            }
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
                : editingReminderId
                  ? 'Update Reminder'
                  : 'Add Reminder'
            }
            onPress={saveReminder}
          />

          {editingReminderId ? (
            <Button
              title="Cancel Edit"
              onPress={resetForm}
            />
          ) : null}
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
                  title="Edit"
                  onPress={() =>
                    startEditing(reminder)
                  }
                />

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
