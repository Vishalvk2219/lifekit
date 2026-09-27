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
  const { theme, colors, setTheme } = useTheme();

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
            ›
          </Text>
        </Pressable>

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