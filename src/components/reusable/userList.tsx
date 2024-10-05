import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { RootStackParams } from "../../navigator/rootStackParams";
import { IUser } from "../../types/user";
import CenterText from "./centerText";
import UserListItem from "./userListItem";
import { useDispatch, useSelector } from "react-redux";
import { getter } from "../../utils/api";
import { setChats, setUsers } from "../../store/reducers/users";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { dateToString } from "../../utils/functions";
import { IChat } from "../../types/chat";
import { IMessages } from "../../types/messages";
import { RootState } from "../../store/reducers";

type userItem = IUser | IChat

type Props = {
    navigation: DrawerNavigationProp<RootStackParams, "home" | "contact">,
    users: userItem[],
    onScreen: "home" | "contact"
}
const UserList = ({ navigation, users, onScreen }: Props) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const { user } = useSelector((state: RootState) => state.userSlice);
    const dispatch = useDispatch();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const data = await getter<userItem[]>(`users/${onScreen === "home" ? "chats" : "all_chat"}`, navigation);
        if (data.ok && data.data) {
            if (onScreen === "home") {
                dispatch(setChats(data.data as IChat[]))
            } else {
                dispatch(setUsers({ users: data.data }))
            }
        }
        setRefreshing(false)
    }, []);
    const lastMessageDate = (item: userItem): string | undefined => {
        if (onScreen === "home" && "messages" in item && Array.isArray(item.messages)) {
            const messagesLength = item.messages.length;
            const lastMessage = item.messages[messagesLength - 1];
            if (lastMessage) {
                return dateToString(lastMessage.date);
            }
        }
    }
    const lastMessageType = (item: userItem): string => {
        if (onScreen === "home" && "messages" in item && Array.isArray(item.messages)) {
            const messagesLength = item.messages.length;
            const lastMessage: IMessages = item.messages[messagesLength - 1];
            if (lastMessage) {
                const result = lastMessage && lastMessage?.file ? lastMessage.file.name : lastMessage?.voice ? "Ovozli habar" : lastMessage?.text
                return result ?? ""
            } else {
                return ""
            }
        } else {
            return item.isonline ? "Onlayn" : `So'ngi faollik: ${dateToString(item.last_upd)}`
        }
    }

    const newMessageCount = (item: userItem): number => {
        try {
            if ("messages" in item && Array.isArray(item.messages) && user) {
                const count = item.messages.filter(m => !m.read && Number(m.user_id) === Number(user.id)).length;
                return count
            }
            return 0
        } catch {
            return 0
        }
    }

    return (
        <ScrollView
            style={{ backgroundColor: "white" }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {
                users && users.length > 0 ? (
                    users.map((e, ind) => (
                        <UserListItem
                            key={ind}
                            user={e}
                            label={lastMessageType(e)}
                            hour={lastMessageDate(e)}
                            handlePress={() => {
                                navigation.navigate("privateMessages", {
                                    user: e
                                })
                            }}
                            messageCount={newMessageCount(e)}
                        />
                    ))
                ) : (
                    <CenterText txt={`Hozircha ${onScreen == "home" ? "suhba" : "kontak"}tlar mavjud emas`} />
                )
            }
        </ScrollView>
    )
}

export default UserList