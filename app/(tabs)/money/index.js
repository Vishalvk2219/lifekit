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
        Money
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        Manage your money and expenses✨
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
import { useState } from "react";
import { Alert, Button, Text, View } from "react-native";

import {
  createExpense,
  getExpenses,
} from "../../../src/features/money/api";

export default function MoneyTest() {
  const [message, setMessage] = useState("");

  const handleTest = async () => {
    try {
      const expense = await createExpense({
        title: "Week 9 Test Expense",
        amount: 100,
        category: "other",
        spentOn: new Date().toISOString().split("T")[0],
      });

      const expenses = await getExpenses();

      setMessage(
        `Created ${expense.title}. Total rows: ${expenses.length}`
      );
    } catch (error) {
      Alert.alert("Money test failed", error.message);
    }
  };

  return (
    <View>
      <Text>Money Week 9 Test</Text>

      <Button
        title="Create Test Expense"
        onPress={handleTest}
      />

      <Text>{message}</Text>
    </View>
  );
}
>>>>>>> b0c4783768333cd557283f09c2720f74ddbffebb
