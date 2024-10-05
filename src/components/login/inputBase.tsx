import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../utils/variables";


type Props = {
    placeholder: string,
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    type: "next" | "done"
}

const InputBase = ({ placeholder, value, setValue, type }: Props) => {
    return (
        <View style={styles.main}>
            <TextInput
                style={styles.inputStyle}
                onChangeText={(txt) =>
                    setValue(txt)
                }
                placeholder={placeholder}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType={type}
                blurOnSubmit={false}
                value={value}
                placeholderTextColor={colors.tgWhite}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        height: 50,
        marginTop: 10,
        marginBottom: 10
    },
    inputStyle: {
        flex: 1,
        color: colors.black,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#dadae8',
        height: 60,
        fontSize: 18,
    },
})

export default InputBase