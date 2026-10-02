import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { useAuth } from '../../../src/context/AuthContext';
import { useTheme } from '../../../src/context/ThemeContext';
import {
  deleteExpense,
  getExpenses,
} from '../../../src/features/money/api';

const CATEGORIES = [
  'food',
  'transport',
  'shopping',
  'bills',
  'health',
  'entertainment',
  'other',
];

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function currentMonthString() {
  return localDateString().slice(0, 7);
}

function money(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

export default function Money() {
  const { colors } = useTheme();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(currentMonthString());

  const loadMoney = useCallback(async (isRefresh = false) => {
    if (!userId) {
      setExpenses([]);
      setError('Please sign in to view your expenses.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError('');

    try {
      const rows = await getExpenses();
      setExpenses(rows);
    } catch (loadError) {
      setError(loadError?.message || 'Unable to load expenses.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadMoney();
    }, [loadMoney])
  );

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        expense.category === selectedCategory;
      const matchesMonth =
        /^\d{4}-\d{2}$/.test(selectedMonth) &&
        String(expense.spent_on || '').slice(0, 7) === selectedMonth;
      return matchesCategory && matchesMonth;
    });
  }, [expenses, selectedCategory, selectedMonth]);

  const monthlyTotal = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const today = localDateString();
  const todayTotal = filteredExpenses
    .filter((expense) => expense.spent_on === today)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const breakdown = useMemo(() => {
    const totals = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.category || 'other';
      totals[category] = (totals[category] || 0) + Number(expense.amount || 0);
    });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses]);

  const maxAmount = Math.max(...breakdown.map((item) => item.amount), 1);
  const cardStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
  };

  const confirmDelete = (expense) => {
  Alert.alert(
    'Delete expense?',
    `Delete "${expense.title}" (${money(expense.amount)})? This cannot be undone.`,
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

            // Refresh the expense list and totals.
            await loadMoney(true);

            Alert.alert('Success', 'Expense deleted successfully.');
          } catch (deleteError) {
            Alert.alert(
              'Could not delete expense',
              deleteError?.message || 'Please try again.'
            );
          }
        },
      },
    ]
  );
};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Money</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Track your spending and expenses
        </Text>

        <View style={[styles.totalCard, cardStyle]}>
          <Text style={[styles.totalLabel, { color: colors.secondaryText }]}>
            Total for {selectedMonth || 'selected month'}
          </Text>
          <Text style={[styles.total, { color: colors.text }]}>
            {money(monthlyTotal)}
          </Text>
          <View style={styles.todayRow}>
            <Text style={[styles.totalLabel, { color: colors.secondaryText }]}>
              Spent today
            </Text>
            <Text style={[styles.todayTotal, { color: colors.text }]}>
              {money(todayTotal)}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          style={[styles.primaryButton, { backgroundColor: colors.button }]}
          onPress={() => router.push('/(tabs)/money/new')}
        >
          <Text style={[styles.primaryButtonText, { color: colors.buttonText }]}>
            + Add Expense
          </Text>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Filters</Text>
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          Month (YYYY-MM)
        </Text>
        <TextInput
          value={selectedMonth}
          onChangeText={setSelectedMonth}
          placeholder="2026-10"
          autoCapitalize="none"
          style={[
            styles.monthInput,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.card },
          ]}
        />
        {!/^\d{4}-\d{2}$/.test(selectedMonth) ? (
          <Text style={styles.validation}>Enter the month as YYYY-MM, for example 2026-10.</Text>
        ) : null}

        <Text style={[styles.label, { color: colors.secondaryText }]}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {['all', ...CATEGORIES].map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.button : colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? colors.buttonText : colors.text,
                    textTransform: 'capitalize',
                  }}
                >
                  {category === 'all' ? 'All' : category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Spending Breakdown
        </Text>

        {loading ? (
          <View style={styles.statusBox}>
            <ActivityIndicator />
            <Text style={[styles.statusText, { color: colors.secondaryText }]}>
              Loading expenses...
            </Text>
          </View>
        ) : error ? (
          <View style={[styles.statusBox, cardStyle]}>
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
            <Pressable
              onPress={() => loadMoney()}
              style={[styles.secondaryButton, { backgroundColor: colors.button }]}
            >
              <Text style={{ color: colors.buttonText, fontWeight: '600' }}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {breakdown.length === 0 ? (
              <View style={[styles.emptyBox, cardStyle]}>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No expenses found
                </Text>
                <Text style={[styles.statusText, { color: colors.secondaryText }]}>
                  Add an expense or change the month/category filters.
                </Text>
              </View>
            ) : (
              breakdown.map((item) => (
                <View key={item.category} style={styles.categoryRow}>
                  <View style={styles.categoryHeader}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>
                      {item.category}
                    </Text>
                    <Text style={[styles.categoryAmount, { color: colors.secondaryText }]}>
                      {money(item.amount)}
                    </Text>
                  </View>
                  <View style={[styles.barBackground, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${(item.amount / maxAmount) * 100}%`,
                          backgroundColor: colors.button,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Expenses ({filteredExpenses.length})
            </Text>

            {filteredExpenses.length === 0 ? (
              <Text style={[styles.statusText, { color: colors.secondaryText }]}>
                No expenses match these filters.
              </Text>
            ) : (
              filteredExpenses.map((expense) => (
                <View key={expense.id} style={[styles.expenseCard, cardStyle]}>
                  <Pressable
                    style={styles.expenseMain}
                    onPress={() => router.push(`/(tabs)/money/${expense.id}`)}
                  >
                    <Text style={[styles.expenseTitle, { color: colors.text }]}>
                      {expense.title}
                    </Text>
                    <Text style={[styles.expenseMeta, { color: colors.secondaryText }]}>
                      {(expense.category || 'other')} · {expense.spent_on}
                    </Text>
                  </Pressable>
                  <View style={styles.expenseActions}>
                    <Text style={[styles.expenseAmount, { color: colors.text }]}>
                      {money(expense.amount)}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push(`/(tabs)/money/${expense.id}`)}
                      hitSlop={8}
                    >
                      <Text style={[styles.actionLink, { color: colors.text }]}>Edit</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => confirmDelete(expense)}
                      hitSlop={8}
                    >
                      <Text style={styles.deleteLink}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </>
        )}
        {refreshing ? (
          <Text style={[styles.statusText, { color: colors.secondaryText }]}>Refreshing...</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 55, paddingBottom: 110 },
  title: { fontSize: 30, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 6, marginBottom: 20 },
  totalCard: { borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 16 },
  totalLabel: { fontSize: 13 },
  total: { fontSize: 30, fontWeight: '700', marginTop: 7 },
  todayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  todayTotal: { fontSize: 16, fontWeight: '700' },
  primaryButton: { padding: 15, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 7 },
  monthInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  validation: { color: '#C62828', marginTop: 6, fontSize: 13 },
  chips: { gap: 8, paddingVertical: 3 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 9 },
  statusBox: { padding: 16, borderWidth: 1, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  statusText: { fontSize: 14, marginTop: 8, lineHeight: 20 },
  errorText: { lineHeight: 21, textAlign: 'center' },
  secondaryButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 9, marginTop: 12 },
  emptyBox: { borderWidth: 1, borderRadius: 12, padding: 18, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  categoryRow: { marginBottom: 15 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  categoryName: { fontSize: 15, textTransform: 'capitalize' },
  categoryAmount: { fontSize: 14 },
  barBackground: { height: 10, borderRadius: 5, overflow: 'hidden' },
  bar: { height: 10, borderRadius: 5 },
  expenseCard: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  expenseMain: { flex: 1, marginRight: 8 },
  expenseTitle: { fontSize: 15, fontWeight: '600' },
  expenseMeta: { fontSize: 12, marginTop: 5, textTransform: 'capitalize' },
  expenseActions: { alignItems: 'flex-end', gap: 6 },
  expenseAmount: { fontSize: 15, fontWeight: '700' },
  actionLink: { fontSize: 13, textDecorationLine: 'underline' },
  deleteLink: { color: '#C62828', fontSize: 13, textDecorationLine: 'underline' },
});
