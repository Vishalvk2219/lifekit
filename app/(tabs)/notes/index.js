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
        Notes
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        What's up buddy? 😎{'\n'}
  Let me help you remember things!! 😉
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