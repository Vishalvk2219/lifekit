import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>

      {/* Settings */}
      <Pressable
        style={styles.settingsButton}
        onPress={() => router.push('/(tabs)/settings')}
      >
        <Text style={styles.settingsIcon}>⚙</Text>
      </Pressable>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>LifeKit</Text>
        <Text style={styles.tagline}>
          Organize your life. Simplify your day.
        </Text>
      </View>

      {/* Welcome Card */}
      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome to LifeKit 👋</Text>
        <Text style={styles.description}>
          Manage your tasks, reminders, money, notes and more — all in one place.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.primaryText}>Login</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.secondaryText}>Create Account</Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    padding: 24,
    justifyContent: 'center',
  },

  settingsButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  settingsIcon: {
    fontSize: 25,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#222',
  },

  tagline: {
    fontSize: 15,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 20,
    elevation: 3,
    marginBottom: 28,
  },

  welcome: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#777',
  },

  buttons: {
    gap: 14,
  },

  primaryButton: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },

  secondaryText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
