import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { signOut } from '../../src/features/account/api';

export default function Settings() {
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
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.icon}>⚙️</Text>
        <View>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Manage your LifeKit account
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.option}>
          <View>
            <Text style={styles.optionTitle}>Profile</Text>
            <Text style={styles.optionText}>
              Manage your account information
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.option}>
          <View>
            <Text style={styles.optionTitle}>Notifications</Text>
            <Text style={styles.optionText}>
              Manage notification preferences
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account Actions</Text>

        <Pressable
          style={styles.logoutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>

      <Text style={styles.version}>LifeKit • Account & Settings</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
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
    color: 'black',
  },

  subtitle: {
    fontSize: 13,
    color: 'gray',
    marginTop: 3,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
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
    color: 'black',
  },

  optionText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
    color: 'gray',
  },

  divider: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 15,
  },

  logoutButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  version: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
    marginTop: 'auto',
    marginBottom: 15,
  },
});
