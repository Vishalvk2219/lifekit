import { Pressable, Text } from "react-native";
import { tokens } from "../theme/tokens";

export default function Button({ title, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                padding: tokens.spacing.medium,
                borderRadius: tokens.radius.medium,
            }}
        >
            <Text>
                {title}
            </Text>
        </Pressable>
    );
}