import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { signUp } from '../../src/features/account/api';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Invalid Password',
        'Password must be of exactly 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
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
      <View style={styles.header}>
        <Text style={styles.logo}>LifeKit</Text>
        <Text style={styles.subtitle}>Create your account</Text>
        <Text style={styles.description}>
          Get started with your personal LifeKit
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          placeholderTextColor="#999"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Create a password"
          placeholderTextColor="#999"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          maxLength={8}
        />

        <Text style={styles.hint}>
          At least 8 characters with uppercase, lowercase, number and special
          character.
        </Text>

        <Pressable style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Create Account</Text>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.normalText}>
            Already have an account?{' '}
          </Text>

          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    padding: 20,
    justifyContent: 'center',
  },

  header: {
    marginBottom: 22,
  },

  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#222',
  },

  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },

  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 18,
    elevation: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 22,
    color: '#222',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
    color: '#444',
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },

  hint: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
    marginBottom: 18,
  },

  signupButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#222',
  },

  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  normalText: {
    color: '#666',
  },

  loginText: {
    fontWeight: 'bold',
  },
});

