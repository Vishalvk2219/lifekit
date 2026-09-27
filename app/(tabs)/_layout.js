import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.secondaryText,

        tabBarStyle: {
          position: 'absolute',
          left: 10,
          right: 10,
          bottom: 50,

          height: 60,

          paddingTop: 2,
          paddingBottom: 4,

          backgroundColor: colors.tabBackground,
          borderTopColor: colors.border,
          borderRadius: 18,

          elevation: 5,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 0,
        },

        tabBarIconStyle: {
          marginBottom: 1,
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