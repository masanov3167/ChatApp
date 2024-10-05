import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../utils/variables";

type Props = {
    label: string;
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    done?: boolean
}

const InputBase = ({ label, value, setValue, done }: Props) => {
    return (
        <View style={styles.main}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                placeholder={label}
                value={value}
                onChangeText={(text) => {
                    setValue(text)
                }}
                autoCapitalize="none"
                returnKeyType={done ? "done" : "next"}
                style={styles.input}
                placeholderTextColor={colors.tgWhite}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        marginTop: 10
    },
    label: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.black,
    },
    input: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(84, 76, 76, 0.14)',
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 17,
        fontWeight: "700",
        backgroundColor: "white",
        color: colors.black
    }
})

export default InputBase