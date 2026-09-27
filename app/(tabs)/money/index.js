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