import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import {
  deleteExpense,
  getExpenses,
} from '../../../src/features/money/api';

const CATEGORIES = [
  'all',
  'food',
  'transport',
  'shopping',
  'bills',
  'health',
  'entertainment',
  'other',
];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getCurrentMonth() {
  return getToday().slice(0, 7);
}

function formatAmount(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

function formatDate(date) {
  if (!date) return '';

  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
}

export default function Money() {
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState(getCurrentMonth());

  const loadExpenses = useCallback(async () => {
    try {
      setError('');

      const data = await getExpenses();

      setExpenses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses])
  );

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory =
        categoryFilter === 'all' ||
        expense.category === categoryFilter;

      const matchesMonth =
        !monthFilter ||
        expense.spent_on?.startsWith(monthFilter);

      return matchesCategory && matchesMonth;
    });
  }, [expenses, categoryFilter, monthFilter]);

  const todayTotal = useMemo(() => {
    const today = getToday();

    return expenses
      .filter((expense) => expense.spent_on === today)
      .reduce((total, expense) => total + Number(expense.amount), 0);
  }, [expenses]);

  const monthTotal = useMemo(() => {
    const currentMonth = getCurrentMonth();

    return expenses
      .filter((expense) => expense.spent_on?.startsWith(currentMonth))
      .reduce((total, expense) => total + Number(expense.amount), 0);
  }, [expenses]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  }, [filteredExpenses]);

  const handleDelete = (expense) => {
    Alert.alert(
      'Delete Expense',
      `Delete "${expense.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);

              setExpenses((current) =>
                current.filter((item) => item.id !== expense.id)
              );
            } catch (error) {
              Alert.alert('Delete Failed', error.message);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading expenses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load expenses</Text>

        <Text style={styles.errorText}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={loadExpenses}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Money</Text>
          <Text style={styles.subtitle}>
            Track your spending
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/money/new')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today</Text>
          <Text style={styles.summaryValue}>
            {formatAmount(todayTotal)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>This Month</Text>
          <Text style={styles.summaryValue}>
            {formatAmount(monthTotal)}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Filters</Text>

      <Text style={styles.filterLabel}>Category</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.filterRow}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.filterButton,
                categoryFilter === category &&
                  styles.filterButtonActive,
              ]}
              onPress={() => setCategoryFilter(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  categoryFilter === category &&
                    styles.filterTextActive,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.filterLabel}>Month</Text>

      <View style={styles.monthRow}>
        <Pressable
          style={[
            styles.monthButton,
            monthFilter === getCurrentMonth() &&
              styles.monthButtonActive,
          ]}
          onPress={() => setMonthFilter(getCurrentMonth())}
        >
          <Text
            style={[
              styles.monthText,
              monthFilter === getCurrentMonth() &&
                styles.monthTextActive,
            ]}
          >
            Current Month
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.monthButton,
            !monthFilter && styles.monthButtonActive,
          ]}
          onPress={() => setMonthFilter('')}
        >
          <Text
            style={[
              styles.monthText,
              !monthFilter && styles.monthTextActive,
            ]}
          >
            All Months
          </Text>
        </Pressable>
      </View>

      <View style={styles.filteredTotalCard}>
        <Text style={styles.filteredTotalLabel}>
          Filtered Total
        </Text>

        <Text style={styles.filteredTotalValue}>
          {formatAmount(filteredTotal)}
        </Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Expenses</Text>

        <Text style={styles.count}>
          {filteredExpenses.length}
        </Text>
      </View>

      {filteredExpenses.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No expenses found
          </Text>

          <Text style={styles.emptyText}>
            Try another filter or add your first expense.
          </Text>

          <Pressable
            style={styles.emptyButton}
            onPress={() => router.push('/(tabs)/money/new')}
          >
            <Text style={styles.emptyButtonText}>
              Add Expense
            </Text>
          </Pressable>
        </View>
      ) : (
        filteredExpenses.map((expense) => (
          <View key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>
                {expense.title}
              </Text>

              <Text style={styles.expenseCategory}>
                {expense.category} • {formatDate(expense.spent_on)}
              </Text>
            </View>

            <View style={styles.expenseRight}>
              <Text style={styles.expenseAmount}>
                {formatAmount(expense.amount)}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  onPress={() =>
                    router.push(
                      `/(tabs)/money/${expense.id}`
                    )
                  }
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDelete(expense)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  statusText: {
    marginTop: 12,
    color: '#666',
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  errorText: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#222',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#777',
    marginTop: 4,
  },

  addButton: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
  },

  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 16,
  },

  summaryLabel: {
    color: '#777',
    fontSize: 13,
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
  },

  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 5,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  filterButtonActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },

  filterText: {
    textTransform: 'capitalize',
    color: '#333',
  },

  filterTextActive: {
    color: '#FFF',
  },

  monthRow: {
    flexDirection: 'row',
    gap: 8,
  },

  monthButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  monthButtonActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },

  monthText: {
    color: '#333',
    fontWeight: '600',
  },

  monthTextActive: {
    color: '#FFF',
  },

  filteredTotalCard: {
    backgroundColor: '#222',
    padding: 18,
    borderRadius: 16,
    marginTop: 18,
  },

  filteredTotalLabel: {
    color: '#CCC',
  },

  filteredTotalValue: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  count: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  expenseCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  expenseInfo: {
    flex: 1,
    marginRight: 10,
  },

  expenseTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  expenseCategory: {
    color: '#777',
    marginTop: 6,
    textTransform: 'capitalize',
  },

  expenseRight: {
    alignItems: 'flex-end',
  },

  expenseAmount: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },

  editText: {
    fontWeight: '600',
  },

  deleteText: {
    color: '#C62828',
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#777',
    textAlign: 'center',
    marginTop: 7,
  },

  emptyButton: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
  },

  emptyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});