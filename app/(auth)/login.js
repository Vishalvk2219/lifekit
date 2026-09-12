import {View, Text, TextInput,Button, StyleSheet} from 'react-native';
import {Supabase} from '../../src/lib/supabase';
export default function Login() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            />
            <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            />
            <Button title="Login" onPress={() => {}} />
                </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
        borderRadius: 4,
    },
});