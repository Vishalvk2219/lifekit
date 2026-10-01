import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';
import { getSummary as getTasksSummary, getTasks } from '../../../src/features/tasks/api';
import { getSummary as getMoneySummary } from '../../../src/features/money/api';
import { getSummary as getNotesSummary } from '../../../src/features/notes/api';

const summaryFunctions = [getTasksSummary, getMoneySummary, getNotesSummary];

const quickActions = [
  { label: 'Add Task', href: '/(tabs)/tasks/new' },
  { label: 'Add Expense', href: '/(tabs)/money/new' },
  { label: 'Add Note', href: '/(tabs)/notes/new' },
  { label: 'Reminder', href: '/(tabs)/tasks/reminders' },
];

export default function Dashboard() {
  const { colors } = useTheme();
  const { session } = useAuth();

  const [summaries, setSummaries] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!session?.user?.id) {
      setSummaries([]);
      setTodayTasks([]);
      setLoading(false);
      return;
    }

    setError('');

    try {
      const userId = session.user.id;

      const results = await Promise.allSettled(
        summaryFunctions.map((getSummary) => getSummary(userId))
      );
      setSummaries(results.filter((r) => r.status === 'fulfilled').map((r) => r.value));

      const tasksResult = await getTasks(userId);
      if (tasksResult.error) throw new Error(tasksResult.error.message);

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      setTodayTasks(
        (tasksResult.data || []).filter((task) => {
          if (!task.due_at) return false;
          const date = new Date(task.due_at);
          return date >= start && date <= end;
        })
      );
    } catch (err) {
      setError(err.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const card = { backgroundColor: colors.card, borderColor: colors.border };

  // Full-screen loader only on the first load (no flicker on refocus)
  if (loading && summaries.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: colors.text }}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Your LifeKit overview
        </Text>

        {error ? (
          <View style={[styles.errorBox, card]}>
            <Text style={{ color: colors.text }}>{error}</Text>
            <Pressable
              onPress={loadDashboard}
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Summary Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>

        <View style={styles.summaryGrid}>
          {summaries.map((summary) => (
            <Pressable
              key={summary.title}
              onPress={() => router.push(summary.href)}
              style={[styles.summaryCard, card]}
            >
              <Text style={[styles.summaryTitle, { color: colors.secondaryText }]}>
                {summary.title}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {summary.value}
              </Text>
              <Text style={[styles.summaryCaption, { color: colors.secondaryText }]}>
                {summary.caption}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

        <View style={styles.actions}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => router.push(action.href)}
              style={({ pressed }) => [
                styles.actionCard,
                card,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.actionText, { color: colors.text }]}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Today's Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Tasks</Text>
          <Pressable onPress={() => router.push('/(tabs)/tasks')}>
            <Text style={{ color: colors.primary }}>View All</Text>
          </Pressable>
        </View>

        {todayTasks.length > 0 ? (
          todayTasks.map((task) => (
            <View key={task.id} style={[styles.taskCard, card]}>
              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    {
                      color: colors.text,
                      textDecorationLine: task.is_done ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {task.title}
                </Text>
                <Text style={[styles.taskTime, { color: colors.secondaryText }]}>
                  {new Date(task.due_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <Text style={{ color: task.is_done ? colors.primary : colors.secondaryText }}>
                {task.is_done ? 'Done' : 'Pending'}
              </Text>
            </View>
          ))
        ) : (
          <View style={[styles.emptyBox, card]}>
            <Text style={{ color: colors.secondaryText }}>No tasks due today.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  title: { fontSize: 30, fontWeight: '700' },
  subtitle: { marginTop: 6, marginBottom: 24, fontSize: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginTop: 10, marginBottom: 12 },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryCard: { width: '48%', borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 },
  summaryTitle: { fontSize: 14 },
  summaryValue: { fontSize: 24, fontWeight: '700', marginTop: 6 },
  summaryCaption: { fontSize: 13, marginTop: 4 },

  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  actionCard: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { fontSize: 15, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskContent: { flex: 1, marginRight: 10 },
  taskTitle: { fontSize: 16, fontWeight: '600' },
  taskTime: { marginTop: 5, fontSize: 13 },

  emptyBox: { borderWidth: 1, borderRadius: 12, padding: 18, alignItems: 'center' },
  errorBox: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 18 },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
