import React from "react";
import { Text } from "react-native";
import { colors } from "../../utils/variables";

type Props = {
    text: string
}

const TextMessages = ({ text }: Props) => {
    return (
        <Text
            style={{
                fontSize: 20,
                color: colors.black,
                opacity: 0.7,
                marginBottom: 5
            }}
        >
            {text}
        </Text>
    )
}

export default TextMessages