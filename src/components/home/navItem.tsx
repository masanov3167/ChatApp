import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import Toast from "react-native-simple-toast";

import { Flex } from "../../utils/globalStyles";
import { userStorage } from "../../mmkv/storage";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";
import Icon, { IIconPropsName } from "../../icons";
import { colors } from "../../utils/variables";
import { socketEmit } from "../../utils/api";

type Props = {
    txt: string,
    route: "home" | "login" | "contact" | "updateProfile",
    navigation: DrawerNavigationHelpers,
    logOut?: boolean,
    iconName: "contacts" | "settings" | "delete"
}
const NavItem = ({ txt, route, navigation, logOut, iconName }: Props) => {
    const handlePress = async () => {
        if (logOut) {
            Alert.alert("Profildan chiqish", "Haqiqatdan ham profilingizdan chiqmoqchimisiz? Keyinroq yana shu login parol bilan qayta kirsangiz bo'ladi",
                [
                    { text: "Yo'q" },
                    {
                        text: "Ha", onPress: async () => {
                            const result = await socketEmit("logout-user", {});
                            if (result.ok) {
                                userStorage.delete("token");
                                navigation.navigate(route);
                            } else {
                                Toast.show("Xatolik, birozdan so'ng urinib ko'ring", 700)
                            }
                        }
                    }
                ]
            )
        } else {
            navigation.navigate(route)
        }
    }
    return (
        <Pressable onPress={handlePress} style={{ ...Flex.row, margin: 3, marginLeft: 0, marginBottom: 10 }}>
            <View style={{ width: 22, height: 22, }}>
                <Icon name={iconName as IIconPropsName} />
            </View>
            <View>
                <Text style={{ ...styles.text, color: colors.black }}>{txt}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 5,
    }
})

export default NavItem