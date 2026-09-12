


import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LifeKit</Text>

      <Button
        title="Login"
        onPress={() => router.push('/(auth)/login')}
      />

      <View style={styles.space} />

      <Button
        title="Sign Up"
        onPress={() => router.push('/(auth)/signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  space: {
    height: 15,
  },
});