import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';

import { useEffect, useState } from 'react';
import { router } from 'expo-router';

import {
  signOut,
  getCurrentUser,
  updateProfile,
} from '../../src/features/account/api';

import { useTheme } from '../../src/context/ThemeContext';

export default function Settings() {
  const { theme, colors, setTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { user, error } = await getCurrentUser();

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Invalid Name', 'Please enter your name.');
      return;
    }

    setSavingProfile(true);

    const { error } = await updateProfile(fullName.trim());

    setSavingProfile(false);

    if (error) {
      Alert.alert('Update Failed', error.message);
      return;
    }

    Alert.alert('Success', 'Profile updated successfully.');
    setProfileOpen(false);
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
        { backgroundColor: colors.background },
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
              { color: colors.text },
            ]}
          >
            Settings
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondaryText },
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
            { color: colors.text },
          ]}
        >
          Account
        </Text>

        {/* Profile */}
        <Pressable
          style={styles.option}
          onPress={() => {
            setProfileOpen(!profileOpen);

            if (!profileOpen) {
              loadProfile();
            }
          }}
        >
          <View>
            <Text
              style={[
                styles.optionTitle,
                { color: colors.text },
              ]}
            >
              Profile
            </Text>

            <Text
              style={[
                styles.optionText,
                { color: colors.secondaryText },
              ]}
            >
              Manage your account information
            </Text>
          </View>

          <Text
            style={[
              styles.arrow,
              { color: colors.secondaryText },
            ]}
          >
            {profileOpen ? '⌃' : '›'}
          </Text>
        </Pressable>

        {/* Profile Editor */}
        {profileOpen && (
          <View
            style={[
              styles.profileEditor,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Full Name */}
            <Text
              style={[
                styles.inputLabel,
                { color: colors.text },
              ]}
            >
              Full Name
            </Text>

            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.secondaryText}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            />

            {/* Email */}
            <Text
              style={[
                styles.inputLabel,
                { color: colors.text },
              ]}
            >
              Email
            </Text>

            <TextInput
              value={email}
              editable={false}
              style={[
                styles.input,
                styles.disabledInput,
                {
                  color: colors.secondaryText,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            />

            {/* Buttons */}
            <View style={styles.profileActions}>
              <Pressable
                style={[
                  styles.cancelButton,
                  {
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setProfileOpen(false)}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: colors.text },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: colors.button,
                  },
                ]}
                onPress={handleSaveProfile}
                disabled={savingProfile}
              >
                <Text
                  style={[
                    styles.saveText,
                    { color: colors.buttonText },
                  ]}
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* Notifications */}
        <Pressable
          style={styles.option}
          onPress={() =>
            Alert.alert(
              'Notifications',
              'Notification preferences coming soon'
            )
          }
        >
          <View>
            <Text
              style={[
                styles.optionTitle,
                { color: colors.text },
              ]}
            >
              Notifications
            </Text>

            <Text
              style={[
                styles.optionText,
                { color: colors.secondaryText },
              ]}
            >
              Manage notification preferences
            </Text>
          </View>

          <Text
            style={[
              styles.arrow,
              { color: colors.secondaryText },
            ]}
          >
            ›
          </Text>
        </Pressable>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        {/* Theme */}
        <View>
          <Text
            style={[
              styles.optionTitle,
              { color: colors.text },
            ]}
          >
            Theme
          </Text>

          <Text
            style={[
              styles.optionText,
              { color: colors.secondaryText },
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
                  { color: colors.text },
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
                  { color: colors.text },
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
            { color: colors.text },
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
              { color: colors.buttonText },
            ]}
          >
            Sign Out
          </Text>
        </Pressable>
      </View>

      <Text
        style={[
          styles.version,
          { color: colors.secondaryText },
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

  /* Profile */

  profileEditor: {
    marginTop: 15,
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  disabledInput: {
    opacity: 0.7,
  },

  profileActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },

  saveButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  /* Theme */

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

  /* Logout */

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