<<<<<<< HEAD
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../src/context/ThemeContext';

export default function Money() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Tasks
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        Let me help you remember what to do next🤔
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 8,
  },
});
=======
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { format } from 'date-fns';

import Screen from '../../../src/components/Screen';
import Button from '../../../src/components/Button';
import Card from '../../../src/components/Card';

import {
  deleteTask,
  getCurrentUserId,
  getTasks,
  toggleTask,
} from '../../../src/features/tasks/api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);

    const userResult = await getCurrentUserId();

    if (userResult.error || !userResult.userId) {
      setError('You must be logged in to view tasks.');
      setLoading(false);
      return;
    }

    const result = await getTasks(userResult.userId);

    if (result.error) {
      setError(result.error.message);
    } else {
      setTasks(result.data || []);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'done') {
      return task.is_done;
    }

    if (filter === 'open') {
      return !task.is_done;
    }

    return true;
  });

  const openTasks = filteredTasks.filter((task) => !task.is_done);
  const completedTasks = filteredTasks.filter((task) => task.is_done);

  const handleToggle = async (task) => {
    const userResult = await getCurrentUserId();

    if (userResult.error || !userResult.userId) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }

    const result = await toggleTask(
      task.id,
      userResult.userId,
      !task.is_done
    );

    if (result.error) {
      Alert.alert('Error', result.error.message);
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? { ...item, is_done: !item.is_done }
          : item
      )
    );
  };

  const handleDelete = (task) => {
    Alert.alert(
      'Delete task',
      `Delete "${task.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const userResult = await getCurrentUserId();

            if (userResult.error || !userResult.userId) {
              Alert.alert('Error', 'You must be logged in.');
              return;
            }

            const result = await deleteTask(
              task.id,
              userResult.userId
            );

            if (result.error) {
              Alert.alert('Error', result.error.message);
              return;
            }

            setTasks((current) =>
              current.filter((item) => item.id !== task.id)
            );
          },
        },
      ]
    );
  };

  const renderTask = (task) => (
    <Card key={task.id}>
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            textDecorationLine: task.is_done
              ? 'line-through'
              : 'none',
          }}
        >
          {task.title}
        </Text>

        <Text>
          {task.category} · {task.priority}
        </Text>

        {task.due_at ? (
          <Text>
            Due: {format(new Date(task.due_at), 'dd MMM yyyy, h:mm a')}
          </Text>
        ) : null}

        {task.notes ? <Text>{task.notes}</Text> : null}

        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 8,
          }}
        >
          <Button
            title={task.is_done ? 'Undo' : 'Complete'}
            onPress={() => handleToggle(task)}
          />

          <Button
            title="Edit"
            onPress={() =>
              router.push(`/(tabs)/tasks/${task.id}`)
            }
          />

          <Button
            title="Delete"
            onPress={() => handleDelete(task)}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <Screen>
      <ScrollView>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 16,
          }}
        >
          Tasks
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Button
            title="New Task"
            onPress={() => router.push('/(tabs)/tasks/new')}
          />

          <Button
            title="Reminders"
            onPress={() =>
              router.push('/(tabs)/tasks/reminders')
            }
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 16,
          }}
        >
          {['all', 'open', 'done'].map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={{
                padding: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <Text>{item.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>

        {loading ? <Text>Loading tasks...</Text> : null}

        {!loading && error ? (
          <View>
            <Text>Error: {error}</Text>
            <Button title="Retry" onPress={loadTasks} />
          </View>
        ) : null}

        {!loading && !error && filteredTasks.length === 0 ? (
          <Text>No tasks found.</Text>
        ) : null}

        {!loading && !error && openTasks.length > 0 ? (
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              To Do
            </Text>

            {openTasks.map(renderTask)}
          </View>
        ) : null}

        {!loading && !error && completedTasks.length > 0 ? (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              Completed
            </Text>

            {completedTasks.map(renderTask)}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
>>>>>>> b0c4783768333cd557283f09c2720f74ddbffebb
