import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { signUp} from '../../src/features/account/api';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    


if (password.length < 8 || password.length > 8) {
  Alert.alert('Invalid Password', 'Password must be exactly 8 characters long');
  return;
}

if (!/[A-Z]/.test(password)) {
  Alert.alert('Invalid Password', 'Password must contain at least one uppercase letter');
  return;
}

if (!/[a-z]/.test(password)) {
  Alert.alert('Invalid Password', 'Password must contain at least one lowercase letter');
  return;
}

if (!/[0-9]/.test(password)) {
  Alert.alert('Invalid Password', 'Password must contain at least one number');
  return;
}

if (!/[!@#$%^&*]/.test(password)) {
  Alert.alert('Invalid Password', 'Password must contain at least one special character');
  return;
}

    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const { error } = await signUp(fullName, email, password);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
      return;
    }

    Alert.alert('Success', 'Account created successfully');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={ styles.hint}>Password must be exactly 8 characters with uppercase, lowercase, number, and special character</Text>

      <Button title="Sign Up" onPress={handleSignup} />
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
    hint: {
    fontSize: 12,
    color: 'red',
    marginBottom: 12,
  },
});
