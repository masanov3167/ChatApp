import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";

import { Flex } from "../../utils/globalStyles";
import { colors } from "../../utils/variables";

type Props = {
    txt: string
}
const CenterText = ({ txt }: Props) => {
    return (
        <View style={styles.textWrapper}>
            <Text style={styles.text}>{txt}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    textWrapper: {
        ...Flex.row,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        color: colors.black
    }
})

export default CenterText