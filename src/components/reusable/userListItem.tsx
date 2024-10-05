import React from "react";
import { TouchableWithoutFeedback, StyleSheet, View, Text, Linking, Pressable } from "react-native";
import { Badge } from "react-native-elements";

import { colors } from "../../utils/variables";
import UserPic from "../reusable/userPic";
import { Flex } from "../../utils/globalStyles";
import { IUser } from "../../types/user";

type Props = {
    user: IUser,
    messageCount?: number,
    hour?: string,
    label: string,
    handlePress: () => void,
    disableStatus?: boolean
}
const UserListItem = ({ user, messageCount, hour, label, handlePress, disableStatus }: Props) => {

    const handlePhonePress = () => {
        Linking.openURL(`tel:${user.phone}`);
    };
    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={{ ...styles.main, ...Flex.row }} >
                <UserPic txt={user.name} isonline={user.isonline} disableStatus={disableStatus} />
                <View style={styles.right}>
                    <View style={{ ...Flex.row }}>
                        <View style={{ ...Flex.row }}>
                            <View>
                                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>{user.name}</Text>
                            </View>
                            <Pressable onPress={handlePhonePress}>
                                <Text style={styles.phone}>({user.phone})</Text>
                            </Pressable>
                        </View>
                        <View>
                            {
                                hour && <Text style={styles.hour}>{hour}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ ...Flex.row }}>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={{ color: colors.lightBlue, marginRight: 50 }}>{label}</Text>
                        {
                            messageCount ? (
                                <Text>
                                    <Badge value={String(messageCount > 99 ? "99+" : messageCount)} />
                                </Text>
                            ) : (
                                <></>
                            )
                        }
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    main: {
        padding: 10,
        backgroundColor: "white"
    },
    right: {
        flex: 1,
        marginLeft: 10,
        borderColor: "gainsboro",
        borderBottomWidth: 0.8,
        paddingBottom: 7
    },
    name: {
        fontWeight: "700",
        fontSize: 16,
        maxWidth: 100,
        color: colors.black,
        opacity: 0.8
    },
    phone: {
        fontWeight: "500",
        opacity: 0.5,
        fontSize: 14,
        marginLeft: 5,
        color: colors.black
    },
    hour: {
        fontSize: 13,
        color: colors.black
    }
});
export default UserListItem
