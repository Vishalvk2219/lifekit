import {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';

import { useTheme } from '../../../src/context/ThemeContext';

import {
  getMonthlyTotal,
  getCategoryBreakdown,
} from '../../../src/features/money/api';

export default function Money() {
  const { colors } = useTheme();

  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadMoney = useCallback(
    async () => {
      try {
        setLoading(true);
        setError('');

        const [
          monthlyTotal,
          categories,
        ] = await Promise.all([
          getMonthlyTotal(
            undefined
          ),
          getCategoryBreakdown(
            undefined
          ),
        ]);

        setTotal(monthlyTotal);
        setBreakdown(categories);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      loadMoney();
    }, [loadMoney])
  );

  const maxAmount = Math.max(
    ...breakdown.map(
      (item) => Number(item.amount)
    ),
    1
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
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
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        Manage your money and expenses
      </Text>

      {loading ? (
        <Text
          style={[
            styles.message,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Loading...
        </Text>
      ) : null}

      {!loading && error ? (
        <View>
          <Text
            style={[
              styles.error,
              { color: colors.text },
            ]}
          >
            {error}
          </Text>

          <Pressable
            style={[
              styles.button,
              {
                backgroundColor:
                  colors.button,
              },
            ]}
            onPress={loadMoney}
          >
            <Text
              style={{
                color:
                  colors.buttonText,
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error ? (
        <>
          <View
            style={[
              styles.totalCard,
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
                styles.totalLabel,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              This Month
            </Text>

            <Text
              style={[
                styles.total,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              ₹{total.toFixed(2)}
            </Text>
          </View>

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            Spending Breakdown
          </Text>

          {breakdown.length === 0 ? (
            <Text
              style={[
                styles.message,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              No expenses this month.
            </Text>
          ) : (
            breakdown.map((item) => {
              const percentage =
                (Number(item.amount) /
                  maxAmount) *
                100;

              return (
                <View
                  key={item.category}
                  style={styles.categoryRow}
                >
                  <View
                    style={
                      styles.categoryHeader
                    }
                  >
                    <Text
                      style={[
                        styles.categoryName,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      {item.category}
                    </Text>

                    <Text
                      style={[
                        styles.categoryAmount,
                        {
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      ₹
                      {Number(
                        item.amount
                      ).toFixed(2)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.barBackground,
                      {
                        backgroundColor:
                          colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${percentage}%`,
                          backgroundColor:
                            colors.button,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}

          <Pressable
            style={[
              styles.button,
              {
                backgroundColor:
                  colors.button,
              },
            ]}
            onPress={() =>
              router.push(
                '/(tabs)/money/new'
              )
            }
          >
            <Text
              style={{
                color:
                  colors.buttonText,
                fontWeight: 'bold',
              }}
            >
              Add Expense
            </Text>
          </Pressable>
        </>
      ) : null}
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

  totalCard: {
    marginTop: 25,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },

  totalLabel: {
    fontSize: 13,
  },

  total: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
  },

  categoryRow: {
    marginBottom: 15,
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  categoryName: {
    fontSize: 15,
    textTransform: 'capitalize',
  },

  categoryAmount: {
    fontSize: 14,
  },

  barBackground: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },

  bar: {
    height: 12,
    borderRadius: 6,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  message: {
    marginTop: 20,
  },

  error: {
    marginTop: 20,
  },
});