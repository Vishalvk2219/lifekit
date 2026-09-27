import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  getExpenseById,
  updateExpense,
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

export default function EditExpense() {
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [spentOn, setSpentOn] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadExpense() {
      try {
        setError('');

        const expense = await getExpenseById(id);

        setTitle(expense.title || '');
        setAmount(String(expense.amount ?? ''));
        setCategory(expense.category || 'other');
        setSpentOn(expense.spent_on || '');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadExpense();
  }, [id]);

  const handleUpdate = async () => {
    setError('');

    if (!title.trim()) {
      setError('Please enter an expense title.');
      return;
    }

    const numericAmount = Number(amount);

    if (
      !amount ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError('Please enter an amount greater than 0.');
      return;
    }

    if (!spentOn) {
      setError('Please enter an expense date.');
      return;
    }

    try {
      setSaving(true);

      await updateExpense(id, {
        title,
        amount: numericAmount,
        category,
        spentOn,
      });

      router.back();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading expense...</Text>
      </View>
    );
  }

  if (error && !title) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Expense</Text>

      <Text style={styles.label}>Title</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Amount</Text>

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Category</Text>

      <View style={styles.categories}>
        {CATEGORIES.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.category,
              category === item && styles.categoryActive,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Date</Text>

      <TextInput
        style={styles.input}
        value={spentOn}
        onChangeText={setSpentOn}
        placeholder="YYYY-MM-DD"
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Pressable
        style={styles.saveButton}
        onPress={handleUpdate}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? 'Saving...' : 'Update Expense'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFF',
    fontSize: 16,
  },

  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  category: {
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  categoryActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },

  categoryText: {
    textTransform: 'capitalize',
  },

  categoryTextActive: {
    color: '#FFF',
  },

  error: {
    color: '#C62828',
    marginTop: 15,
    textAlign: 'center',
  },

  saveButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },

  saveText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  backButton: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  backText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});