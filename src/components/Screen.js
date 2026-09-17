import { View } from "react-native";
import { tokens} from "../theme/tokens"

export default function Screen({ children }) {
    return (
        <View
            style={{
                padding: tokens.spacing.medium,
            }}
        >
            {children}
        </View>
    );
}