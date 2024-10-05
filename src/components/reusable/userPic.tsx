import React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";

import { colors } from "../../utils/variables";

type Props = {
    txt: string,
    isonline?: boolean,
    disableStatus?: boolean
}
const UserPic = ({ txt, isonline, disableStatus }: Props) => {
    return (
        <View style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            backgroundColor: colors.lightBlue,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative"
        }}>
            <Text style={{
                color: "white",
                fontWeight: "700",
                fontSize: 20
            }}>
                {txt[0]}
            </Text>
            {
                !disableStatus && <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 50,
                        borderColor: "gray",
                        borderWidth: 1,
                        backgroundColor: isonline ? "green" : "white",
                        position: "absolute",
                        bottom: 0,
                        right: 5
                    }}
                ></View>
            }
        </View>
    )
}

export default UserPic