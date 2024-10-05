import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import { RootStackParams } from '../navigator/rootStackParams';
import { jwtDecoder, navigateReset } from '../utils/functions';
import { useDispatch } from 'react-redux';
import { loginAction, setChats, setUsers } from '../store/reducers/users';
import { getter } from '../utils/api';
import { IUser } from '../types/user';
import { userStorage } from '../mmkv/storage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { colors } from '../utils/variables';
import { IChat } from '../types/chat';

type Props = DrawerScreenProps<RootStackParams, 'splash'>;
const SplashScreen = ({ navigation }: Props) => {
    const dispatch = useDispatch();
    const [text, setText] = useState<string>("Yuklanmoqda...")

    useEffect(() => {
        (async () => {
            const token = userStorage.getString("token");
            if (!token) {
                navigateReset(navigation, "login");
            } else {
                const user = jwtDecoder(token);
                if (user) {
                    dispatch(loginAction(user.payload));
                    const data = await getter<IChat[]>("users/chats", navigation);
                    const users = await getter<IUser[]>("users/all", navigation);
                    if (users.ok && users.data) {
                        dispatch(setUsers({ users: users.data }))
                    }
                    if (data.ok && data.data) {
                        dispatch(setChats(data.data))
                        navigateReset(navigation, "home");
                    } else {
                        setText("Xatolik, Iltimos birozdan so'ng urinib ko'ring")
                    }
                } else {
                    navigateReset(navigation, "login");
                }
            }
        })()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 18, color: colors.black }}>{text}</Text>
            </View>
        </SafeAreaView>
    );
};

export default SplashScreen;