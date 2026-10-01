import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  Share,
} from 'react-native';

import { router } from 'expo-router';

import {
  signOut,
  exportMyData,
  deleteMyAccount,
} from '../../src/features/account/api';

import { useTheme } from '../../src/context/ThemeContext';

export default function Settings() {
  const { theme, colors, setTheme } = useTheme();

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      Alert.alert('Sign Out Failed', error.message);
      return;
    }

    Alert.alert(
      'Success',
      'Signed out successfully'
    );

    router.replace('/');
  };

  // ---------------- EXPORT DATA ----------------

  const handleExportData = async () => {
    const { data, error } = await exportMyData();

    if (error) {
      Alert.alert(
        'Export Failed',
        error.message
      );
      return;
    }

    const exportText = JSON.stringify(
      data,
      null,
      2
    );

    try {
      await Share.share({
        title: 'LifeKit Data Export',
        message: exportText,
      });
    } catch (shareError) {
      Alert.alert(
        'Share Failed',
        shareError.message
      );
    }
  };

  // ---------------- DELETE ACCOUNT ----------------

  const confirmDeleteAccount = async () => {
    const { error } = await deleteMyAccount();

    if (error) {
      Alert.alert(
        'Delete Failed',
        error.message
      );
      return;
    }

    await signOut();

    Alert.alert(
      'Account Deleted',
      'Your LifeKit account has been deleted.'
    );

    router.replace('/');
  };

  const handleDeleteAccount = () => {
    // FIRST CONFIRMATION

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your LifeKit account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          style: 'destructive',

          onPress: () => {
            // SECOND CONFIRMATION

            Alert.alert(
              'Confirm Deletion',
              'Your profile, tasks, reminders, expenses, notes and shopping data will be permanently deleted.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete Permanently',
                  style: 'destructive',
                  onPress: confirmDeleteAccount,
                },
              ]
            );
          },
        },
      ]
    );
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

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.icon}>
          ⚙️
        </Text>

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

      {/* ACCOUNT CARD */}

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

        {/* PROFILE */}

        <Pressable
          style={styles.option}
          onPress={() =>
            router.push('/profile')
          }
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

        {/* NOTIFICATIONS */}

        <Pressable
          style={styles.option}
          onPress={() =>
            router.push('/notifications')
          }
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
              Manage notification preferences
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

        {/* THEME */}

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

            {/* LIGHT */}

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
              onPress={() =>
                setTheme('light')
              }
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

            {/* DARK */}

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
              onPress={() =>
                setTheme('dark')
              }
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

      {/* ACCOUNT ACTIONS */}

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

        {/* EXPORT */}

        <Pressable
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={handleExportData}
        >
          <Text
            style={[
              styles.actionButtonText,
              {
                color: colors.text,
              },
            ]}
          >
            Export My Data
          </Text>
        </Pressable>

        {/* DELETE */}

        <Pressable
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>
            Delete My Account
          </Text>
        </Pressable>

        {/* SIGN OUT */}

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

  actionButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  deleteButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D32F2F',
    marginBottom: 12,
  },

  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
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