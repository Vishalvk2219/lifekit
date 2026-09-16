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
import { signIn } from '../../src/features/account/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      Alert.alert('Login Failed', error.message);
      return;
    }

    Alert.alert('Success', 'Logged in successfully');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LifeKit</Text>
        <Text style={styles.subtitle}>Welcome back 👋</Text>
        <Text style={styles.description}>
          Login to continue to your account
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Login</Text>

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
          placeholder="Enter your password"
          placeholderTextColor="#999"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>

        <Pressable
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <View style={styles.signupRow}>
          <Text style={styles.normalText}>
            Don't have an account?{' '}
          </Text>

          <Pressable
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.signupText}>Sign Up</Text>
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
    marginBottom: 25,
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

  heading: {
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
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },

  forgot: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },

  loginButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#222',
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  normalText: {
    color: '#666',
  },

  signupText: {
    fontWeight: 'bold',
  },
});



