import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';

export default function Dashboard() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            Dashboard
          </Text>

          <Pressable
            style={[
              styles.settingsButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.welcome,
              { color: colors.text },
            ]}
          >
            Welcome to LifeKit 👋
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondaryText },
            ]}
          >
            Organize your life. Simplify your day.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
  },

  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3,
    marginTop: 30,
  },

  settingsIcon: {
    fontSize: 24,
  },

  content: {
    marginTop: 25,
  },

  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 8,
  },
});