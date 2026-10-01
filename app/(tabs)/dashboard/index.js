import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';

import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';

import {
  getSummary as getAccountSummary,
} from '../../../src/features/account/api';

import {
  getSummary as getTasksSummary,
  getTasks,
} from '../../../src/features/tasks/api';

import {
  getSummary as getMoneySummary,
} from '../../../src/features/money/api';

import {
  getSummary as getNotesSummary,
} from '../../../src/features/notes/api';

const summaryFunctions = [
  getAccountSummary,
  getTasksSummary,
  getMoneySummary,
  getNotesSummary,
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
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = session.user.id;

      const results = await Promise.allSettled(
        summaryFunctions.map((getSummary) =>
          getSummary(userId)
        )
      );

      const successfulSummaries = results
        .filter(
          (result) =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value);

      setSummaries(successfulSummaries);

      const taskResult = await getTasks(
        userId
      );

      if (taskResult.error) {
        throw new Error(
          taskResult.error.message
        );
      }

      const today = new Date();

      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const filteredTasks = (
        taskResult.data || []
      ).filter((task) => {
        if (!task.due_at) {
          return false;
        }

        const due = new Date(task.due_at);

        return (
          due >= startOfToday &&
          due < endOfToday
        );
      });

      setTodayTasks(filteredTasks);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const quickActions = [
    {
      title: 'Add Task',
      path: '/(tabs)/tasks/new',
    },
    {
      title: 'Add Expense',
      path: '/(tabs)/money/new',
    },
    {
      title: 'Add Note',
      path: '/(tabs)/notes/new',
    },
    {
      title: 'Reminder',
      path: '/(tabs)/tasks/reminders',
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              Dashboard
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Your day at a glance
            </Text>
          </View>

          <Pressable
            style={[
              styles.settingsButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              router.push(
                '/(tabs)/settings'
              )
            }
          >
            <Text style={styles.settingsIcon}>
              ⚙️
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <Text
            style={[
              styles.message,
              {
                color: colors
                  .secondaryText,
              },
            ]}
          >
            Loading dashboard...
          </Text>
        ) : null}

        {!loading && error ? (
          <View
            style={[
              styles.errorCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.errorText,
                { color: colors.text },
              ]}
            >
              {error}
            </Text>

            <Pressable
              style={[
                styles.retryButton,
                {
                  backgroundColor:
                    colors.button,
                },
              ]}
              onPress={loadDashboard}
            >
              <Text
                style={[
                  styles.retryText,
                  {
                    color:
                      colors.buttonText,
                  },
                ]}
              >
                Retry
              </Text>
            </Pressable>
          </View>
        ) : null}

        {!loading &&
        !error ? (
          <>
            <View style={styles.summaryGrid}>
              {summaries.map((summary) => (
                <Pressable
                  key={summary.title}
                  style={[
                    styles.summaryCard,
                    {
                      backgroundColor:
                        colors.card,
                      borderColor:
                        colors.border,
                    },
                  ]}
                  onPress={() =>
                    router.push(
                      summary.href
                    )
                  }
                >
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        color:
                          colors
                            .secondaryText,
                      },
                    ]}
                  >
                    {summary.title}
                  </Text>

                  <Text
                    style={[
                      styles.cardValue,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {summary.value}
                  </Text>

                  <Text
                    style={[
                      styles.cardCaption,
                      {
                        color:
                          colors
                            .secondaryText,
                      },
                    ]}
                  >
                    {summary.caption}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text },
              ]}
            >
              Quick Actions
            </Text>

            <View style={styles.quickActions}>
              {quickActions.map((action) => (
                <Pressable
                  key={action.title}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor:
                        colors.card,
                      borderColor:
                        colors.border,
                    },
                  ]}
                  onPress={() =>
                    router.push(
                      action.path
                    )
                  }
                >
                  <Text
                    style={[
                      styles.actionText,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {action.title}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.taskHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text },
                ]}
              >
                Today's Tasks
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    '/(tabs)/tasks'
                  )
                }
              >
                <Text
                  style={[
                    styles.viewAll,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  View all
                </Text>
              </Pressable>
            </View>

            {todayTasks.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color:
                        colors
                          .secondaryText,
                    },
                  ]}
                >
                  No tasks due today.
                </Text>
              </View>
            ) : (
              todayTasks.map((task) => (
                <Pressable
                  key={task.id}
                  style={[
                    styles.taskCard,
                    {
                      backgroundColor:
                        colors.card,
                      borderColor:
                        colors.border,
                    },
                  ]}
                  onPress={() =>
                    router.push(
                      `/(tabs)/tasks/${task.id}`
                    )
                  }
                >
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                  >
                    {task.is_done
                      ? '✓ '
                      : ''}
                    {task.title}
                  </Text>

                  <Text
                    style={[
                      styles.taskMeta,
                      {
                        color:
                          colors
                            .secondaryText,
                      },
                    ]}
                  >
                    {task.category} •{' '}
                    {task.priority}
                  </Text>
                </Pressable>
              ))
            )}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: 18,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
  },

  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsIcon: {
    fontSize: 22,
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  summaryCard: {
    width: '48%',
    minHeight: 130,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 13,
  },

  cardValue: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 10,
  },

  cardCaption: {
    fontSize: 12,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  actionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },

  actionText: {
    fontWeight: '600',
  },

  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  viewAll: {
    fontWeight: '600',
  },

  taskCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  taskMeta: {
    fontSize: 12,
    marginTop: 6,
  },

  emptyCard: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
  },

  emptyText: {
    textAlign: 'center',
  },

  message: {
    textAlign: 'center',
    marginTop: 20,
  },

  errorCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
  },

  errorText: {
    marginBottom: 12,
  },

  retryButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  retryText: {
    fontWeight: 'bold',
  },
});