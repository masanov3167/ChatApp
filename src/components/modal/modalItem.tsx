import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon, { IIconPropsName } from "../../icons";
import { Flex } from "../../utils/globalStyles";
import { colors } from "../../utils/variables";

type Props = {
    txt: string,
    iconName: string,
    onPress: () => void
}

const ModalItem = ({ txt, iconName, onPress }: Props) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <View style={styles.icon}><Icon name={iconName as IIconPropsName} /></View>
            <View><Text style={styles.text}>{txt}</Text></View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        padding: 7,
    },
    text: {
        color: colors.black,
        fontSize: 17,
        fontWeight: "600",
        marginLeft: 3
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 7,
        marginRight: 7
    }
})

export default ModalItem;