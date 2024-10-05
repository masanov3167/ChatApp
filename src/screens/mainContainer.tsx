import React, { ReactElement, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { RootStackParams } from "../navigator/rootStackParams";
import { jwtDecoder, navigateReset } from "../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/reducers";
import { addCurrentChatMessages, deleteCurrentChatMessages, logOutAction, loginAction, updateChats, updateCurrentChatMessages, updateUserStatus } from "../store/reducers/users";
import { userStorage } from "../mmkv/storage";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { colors } from "../utils/variables";
import { Default } from "../utils/globalStyles";
import { socket } from "../context";

type Props = {
    navigation: DrawerNavigationProp<RootStackParams, any>,
    children: React.ReactNode
}

const MainContainer = ({ navigation, children }: Props): ReactElement => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.userSlice);
    useEffect(() => {
        (async () => {
            const token = userStorage.getString("token");
            if (!token) {
                navigateReset(navigation, "login");
            } else {
                if (!user) {
                    const decodedUser = jwtDecoder(token);
                    if (decodedUser) {
                        dispatch(loginAction(decodedUser.payload))
                    } else {
                        userStorage.delete("token");
                        dispatch(logOutAction());
                        navigateReset(navigation, "login");
                    }
                }
            }
        })()
    }, []);

    useEffect(() => {
        socket.on("user_connect_status", payload => {
            dispatch(updateUserStatus({ id: payload.id, status: payload.isonline }));
        });
        socket.on("answer-new-message", msg => {
            dispatch(addCurrentChatMessages(msg));
            console.log(msg);
        });
        socket.on("answer-new-voice-message", msg => {
            dispatch(addCurrentChatMessages(msg))
        });
        socket.on("answer-new-file-message", msg => {
            dispatch(addCurrentChatMessages(msg))
        });
        socket.on("answer-update-text-message", msg => {
            dispatch(updateCurrentChatMessages(msg));
        });
        socket.on("answer-delete-message", msg => {
            dispatch(deleteCurrentChatMessages(msg.id));
        });
        socket.on("answer-read-message", msg => {
            dispatch(updateChats(msg))
        });
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, ...Default.bg }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.blue} />
            {children}
        </SafeAreaView>
    )
}

export default MainContainer;