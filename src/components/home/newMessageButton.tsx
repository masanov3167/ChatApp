import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Flex } from "../../utils/globalStyles";
import Icon from "../../icons";

type Props = {
    onPress: () => void
}

const NewMessageButton = ({ onPress }: Props) => {
    return (
        <Pressable style={styles.pressable} onPress={onPress}>
            <View style={styles.icon}>
                <Icon name="edit" />
            </View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    pressable: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: "azure",
        ...Flex.row,
        justifyContent: "center",
        elevation: 5
    },
    icon: {
        width: 20,
        height: 20
    }
})

export default NewMessageButton