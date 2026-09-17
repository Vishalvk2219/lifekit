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