import { TextInput } from "react-native";
import { tokens } from "../theme/tokens";

export default function Input({ value, onChangeText, placeholder }) {
    return(
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={{
                padding: tokens.spacing.medium,
                borderWidth: 1,
                borderRadius: tokens.radius.medium,
            }}
        />
    );
}