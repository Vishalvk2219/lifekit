import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const currentGroup = segments[0];

    // User is logged in
    if (session && currentGroup !== '(tabs)') {
      router.replace('/(tabs)/dashboard');
    }

    // User is logged out
    if (!session && currentGroup === '(tabs)') {
      router.replace('/');
    }
  }, [session, loading, segments]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </AuthProvider>
  );
}