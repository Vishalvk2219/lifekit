import { View, Text } from "react-native";

export default function EmptyState({ message }) {
    return(
        <View>
            <Text>
                {message}
            </Text>
        </View>
    );
}