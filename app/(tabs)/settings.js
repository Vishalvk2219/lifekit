import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { signOut } from '../../src/features/account/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function Settings() {
  const { theme, colors, setTheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [moneyNotifications, setMoneyNotifications] = useState(true);

  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        'notificationPreferences'
      );

      if (saved) {
        const preferences = JSON.parse(saved);

        setNotificationsEnabled(
          preferences.notificationsEnabled ?? true
        );

        setTaskNotifications(
          preferences.taskNotifications ?? true
        );

        setReminderNotifications(
          preferences.reminderNotifications ?? true
        );

        setMoneyNotifications(
          preferences.moneyNotifications ?? true
        );
      }
    } catch (error) {
      console.log('Failed to load notification preferences:', error);
    }
  };

  const saveNotificationPreferences = async (
    updatedPreferences
  ) => {
    try {
      await AsyncStorage.setItem(
        'notificationPreferences',
        JSON.stringify(updatedPreferences)
      );
    } catch (error) {
      console.log(
        'Failed to save notification preferences:',
        error
      );
    }
  };

  const handleNotificationsToggle = async (value) => {
    setNotificationsEnabled(value);

    await saveNotificationPreferences({
      notificationsEnabled: value,
      taskNotifications,
      reminderNotifications,
      moneyNotifications,
    });
  };

  const handleTaskToggle = async (value) => {
    setTaskNotifications(value);

    await saveNotificationPreferences({
      notificationsEnabled,
      taskNotifications: value,
      reminderNotifications,
      moneyNotifications,
    });
  };

  const handleReminderToggle = async (value) => {
    setReminderNotifications(value);

    await saveNotificationPreferences({
      notificationsEnabled,
      taskNotifications,
      reminderNotifications: value,
      moneyNotifications,
    });
  };

  const handleMoneyToggle = async (value) => {
    setMoneyNotifications(value);

    await saveNotificationPreferences({
      notificationsEnabled,
      taskNotifications,
      reminderNotifications,
      moneyNotifications: value,
    });
  };

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      Alert.alert('Sign Out Failed', error.message);
      return;
    }

    Alert.alert('Success', 'Signed out successfully');
    router.replace('/');
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>⚙️</Text>

        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Settings
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Manage your LifeKit account
          </Text>
        </View>
      </View>

      {/* Account Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Account
        </Text>

        {/* Profile */}
        <Pressable
          style={styles.option}
          onPress={() => router.push('/profile')}
        >
          <View>
            <Text
              style={[
                styles.optionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              Profile
            </Text>

            <Text
              style={[
                styles.optionText,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Manage your account information
            </Text>
          </View>

          <Text
            style={[
              styles.arrow,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            ›
          </Text>
        </Pressable>

        <View
          style={[
            styles.divider,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        {/* Notifications */}
        <View>
          <View style={styles.option}>
            <View style={styles.optionInfo}>
              <Text
                style={[
                  styles.optionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Notifications
              </Text>

              <Text
                style={[
                  styles.optionText,
                  {
                    color: colors.secondaryText,
                  },
                ]}
              >
                Manage your notification preferences
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
            />
          </View>

          {/* Notification Types */}
          {notificationsEnabled && (
            <View
              style={[
                styles.notificationBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Tasks */}
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Task Notifications
                  </Text>

                  <Text
                    style={[
                      styles.notificationText,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    Get notified about your tasks
                  </Text>
                </View>

                <Switch
                  value={taskNotifications}
                  onValueChange={handleTaskToggle}
                />
              </View>

              {/* Reminders */}
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Reminder Notifications
                  </Text>

                  <Text
                    style={[
                      styles.notificationText,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    Get notified about upcoming reminders
                  </Text>
                </View>

                <Switch
                  value={reminderNotifications}
                  onValueChange={handleReminderToggle}
                />
              </View>

              {/* Money */}
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Money Notifications
                  </Text>

                  <Text
                    style={[
                      styles.notificationText,
                      {
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    Get notified about money updates
                  </Text>
                </View>

                <Switch
                  value={moneyNotifications}
                  onValueChange={handleMoneyToggle}
                />
              </View>
            </View>
          )}
        </View>

        <View
          style={[
            styles.divider,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        {/* Theme */}
        <View>
          <Text
            style={[
              styles.optionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Theme
          </Text>

          <Text
            style={[
              styles.optionText,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Choose your app theme
          </Text>

          <View style={styles.themeButtons}>
            {/* Light */}
            <Pressable
              style={[
                styles.themeButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
                theme === 'light' && {
                  borderWidth: 2,
                  borderColor: colors.text,
                },
              ]}
              onPress={() => setTheme('light')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                ☀️ Light
              </Text>
            </Pressable>

            {/* Dark */}
            <Pressable
              style={[
                styles.themeButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
                theme === 'dark' && {
                  borderWidth: 2,
                  borderColor: colors.text,
                },
              ]}
              onPress={() => setTheme('dark')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                🌙 Dark
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Account Actions */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.text,
            },
          ]}
        >
          Account Actions
        </Text>

        <Pressable
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.button,
            },
          ]}
          onPress={handleSignOut}
        >
          <Text
            style={[
              styles.logoutText,
              {
                color: colors.buttonText,
              },
            ]}
          >
            Sign Out
          </Text>
        </Pressable>
      </View>

      <Text
        style={[
          styles.version,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        LifeKit • Account & Settings
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 25,
  },

  icon: {
    fontSize: 38,
    marginRight: 14,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },

  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  optionInfo: {
    flex: 1,
    marginRight: 15,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  optionText: {
    fontSize: 12,
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
  },

  divider: {
    height: 1,
    marginVertical: 15,
  },

  notificationBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },

  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  notificationInfo: {
    flex: 1,
    marginRight: 15,
  },

  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  notificationText: {
    fontSize: 11,
    marginTop: 3,
  },

  themeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  themeButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
  },

  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  logoutButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
});