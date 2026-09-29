import {
  Stack,
  useRouter,
  useSegments,
} from 'expo-router';

import { useEffect } from 'react';

import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();

  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    const currentGroup = segments[0];

    if (
      session &&
      currentGroup !== '(tabs)'
    ) {
      router.replace('/(tabs)/dashboard');
    }

    if (
      !session &&
      currentGroup === '(tabs)'
    ) {
      router.replace('/');
    }
  }, [
    session,
    loading,
    segments,
    router,
  ]);

  if (loading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}