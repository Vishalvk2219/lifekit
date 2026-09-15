import { View } from "react-native";
import { tokens } from "../theme/tokens";

export default function Card({ children }) {
    return(
        <View
            style={{
                padding: tokens.spacing.medium,
                borderRadius: tokens.radius.medium,
                borderWidth: 1,
            }}
        >
            {children}
        </View>
    );
}