import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

import { forgotPassword, updatePassword } from '../../src/features/account/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);

    const { error } = await forgotPassword(email.trim());

    setLoading(false);

    if (error) {
      Alert.alert('Failed', error.message);
      return;
    }

    Alert.alert(
      'Success',
      'Password reset link has been sent to your email.'
    );

    setResetMode(true);
  };

  const handleUpdatePassword = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters.'
      );
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    setLoading(false);

    if (error) {
      Alert.alert('Failed', error.message);
      return;
    }

    Alert.alert(
      'Success',
      'Your password has been updated successfully.'
    );

    setPassword('');
    setResetMode(false);
  };

  return (
    <View style={styles.container}>

      {!resetMode ? (
        <>
          <Text style={styles.title}>Forgot Password</Text>

          <Text style={styles.subtitle}>
            Enter your email to receive a password reset link.
          </Text>

          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Pressable
            style={styles.button}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.subtitle}>
            Enter your new password.
          </Text>

          <TextInput
            placeholder="New password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={styles.button}
            onPress={handleUpdatePassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Updating...' : 'Update Password'}
            </Text>
          </Pressable>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
  },

  button: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});