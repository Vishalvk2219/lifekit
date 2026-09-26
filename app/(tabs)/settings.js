import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { router } from 'expo-router';
import { signOut } from '../../src/features/account/api';
import { useTheme } from '../../src/context/ThemeContext';

export default function Settings() {
  const { theme, themeMode, changeTheme } = useTheme();

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
        { backgroundColor: theme.background },
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
              { color: theme.text },
            ]}
          >
            Settings
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.secondaryText },
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
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          Account
        </Text>

        {/* Profile */}
        <Pressable
          style={styles.option}
          onPress={() =>
            Alert.alert(
              'Profile',
              'Profile screen coming soon'
            )
          }
        >
          <View>
            <Text
              style={[
                styles.optionTitle,
                { color: theme.text },
              ]}
            >
              Profile
            </Text>

            <Text
              style={[
                styles.optionText,
                { color: theme.secondaryText },
              ]}
            >
              Manage your account information
            </Text>
          </View>

          <Text
            style={[
              styles.arrow,
              { color: theme.secondaryText },
            ]}
          >
            ›
          </Text>
        </Pressable>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme.border },
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
                { color: theme.text },
              ]}
            >
              Notifications
            </Text>

            <Text
              style={[
                styles.optionText,
                { color: theme.secondaryText },
              ]}
            >
              Manage notification preferences
            </Text>
          </View>

          <Text
            style={[
              styles.arrow,
              { color: theme.secondaryText },
            ]}
          >
            ›
          </Text>
        </Pressable>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme.border },
          ]}
        />

        {/* Theme */}
        <View>
          <Text
            style={[
              styles.optionTitle,
              { color: theme.text },
            ]}
          >
            Theme
          </Text>

          <Text
            style={[
              styles.optionText,
              { color: theme.secondaryText },
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
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
                themeMode === 'light' && {
                  borderWidth: 2,
                  borderColor: theme.text,
                },
              ]}
              onPress={() => changeTheme('light')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: theme.text },
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
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                },
                themeMode === 'dark' && {
                  borderWidth: 2,
                  borderColor: theme.text,
                },
              ]}
              onPress={() => changeTheme('dark')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: theme.text },
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
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text },
          ]}
        >
          Account Actions
        </Text>

        <Pressable
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.button,
            },
          ]}
          onPress={handleSignOut}
        >
          <Text
            style={[
              styles.logoutText,
              { color: theme.buttonText },
            ]}
          >
            Sign Out
          </Text>
        </Pressable>
      </View>

      <Text
        style={[
          styles.version,
          { color: theme.secondaryText },
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