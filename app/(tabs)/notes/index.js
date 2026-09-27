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
<<<<<<< HEAD
    paddingTop: 60,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 8,
=======
    backgroundColor: '#F5F7FB',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
  },

  subtitle: {
    color: '#777',
    marginTop: 5,
    marginBottom: 25,
  },

  button: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  secondaryButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },

  secondaryButtonText: {
    color: '#222',
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 12,
  },

  noteCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  noteTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  noteBody: {
    marginTop: 6,
    color: '#666',
>>>>>>> b0c4783768333cd557283f09c2720f74ddbffebb
  },
});