import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.secondaryText,

        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 60,
          paddingTop: 4,
          paddingBottom: 4,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 0,
        },

        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: () => (
            <Text style={{ fontSize: 15 }}>🏠</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="money"
        options={{
          title: 'Money',
          tabBarIcon: () => (
            <Text style={{ fontSize: 15 }}>💰</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarIcon: () => (
            <Text style={{ fontSize: 15 }}>📝</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: () => (
            <Text style={{ fontSize: 15 }}>✅</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => (
            <Text style={{ fontSize: 15 }}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}