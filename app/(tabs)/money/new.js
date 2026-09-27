import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { createExpense } from '../../../src/features/money/api';

const CATEGORIES = [
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

export default function NewExpense() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [spentOn, setSpentOn] = useState(getToday());

  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSave = async () => {
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Please enter an expense title.');
      return;
    }

    const numericAmount = Number(amount);

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setValidationError('Please enter an amount greater than 0.');
      return;
    }

    if (!spentOn) {
      setValidationError('Please enter an expense date.');
      return;
    }

    try {
      setSaving(true);

      await createExpense({
        title,
        amount: numericAmount,
        category,
        spentOn,
      });

      Alert.alert('Success', 'Expense added successfully.');
      router.back();
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      <Text style={styles.label}>Title</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Lunch"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Amount</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 250"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Category</Text>

      <View style={styles.categoryContainer}>
        {CATEGORIES.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.categoryButton,
              category === item && styles.categoryButtonActive,
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
        placeholder="YYYY-MM-DD"
        value={spentOn}
        onChangeText={setSpentOn}
      />

      {validationError ? (
        <Text style={styles.error}>{validationError}</Text>
      ) : null}

      <Pressable
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving ? 'Saving...' : 'Save Expense'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFF',
    fontSize: 16,
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#FFF',
  },

  categoryButtonActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },

  categoryText: {
    color: '#333',
    textTransform: 'capitalize',
  },

  categoryTextActive: {
    color: '#FFF',
  },

  error: {
    color: '#C62828',
    marginTop: 15,
    lineHeight: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});