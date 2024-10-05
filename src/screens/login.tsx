import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Pressable,
    StatusBar,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Toast from "react-native-simple-toast"

import Loader from '../components/reusable/loader';
import { getter, poster } from '../utils/api';
import { RootStackParams } from '../navigator/rootStackParams';
import InputBase from '../components/login/inputBase';
import { submitBtn } from '../utils/globalStyles';
import { IUser, IUserWithToken } from '../types/user';
import { ILogin } from '../types/login';
import { navigateReset } from '../utils/functions';
import { useDispatch } from 'react-redux';
import { logOutAction, loginAction, setChats, setUsers } from '../store/reducers/users';
import { userStorage } from '../mmkv/storage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { IChat } from '../types/chat';

type Props = DrawerScreenProps<RootStackParams, 'login'>;
const LoginScreen = ({ navigation }: Props) => {
    const [userLogin, setUserLogin] = useState('');
    const [userParol, setUserParol] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const token = userStorage.getString("token");
            if (token) {
                navigateReset(navigation, "home");
            } else {
                dispatch(logOutAction())
                dispatch(setUsers({ users: [] }));
                dispatch(setUsers({ users: [] }))
            }
        })()
    }, [])

    const handleSubmit = async () => {
        if (!userLogin || userLogin && userLogin.trim().length == 0) {
            setErrortext("Iltimos loginni kiriting")
            return;
        }
        if (!userParol || userParol && userParol.trim().length == 0) {
            setErrortext("Iltimos parolni kiriting")
            return;
        }
        setErrortext('');
        setLoading(true);

        const body: ILogin = { login: userLogin, parol: userParol }
        const postResult = await poster<IUserWithToken, ILogin>("users/login", { data: body, json: true })
        setLoading(false)

        if (postResult.ok && postResult.data) {
            userStorage.set("token", postResult.data.token);
            dispatch(loginAction(postResult.data))
            const users = await getter<IUser[]>("users/all", navigation);
            if (users.ok && users.data) {
                dispatch(setUsers({ users: users.data }))
            }
            const chats = await getter<IChat[]>("users/chats", navigation);
            if (chats.ok && chats.data) {
                dispatch(setChats(chats.data));
            }
            navigateReset(navigation, "home")
            Toast.show("Muvaffaqiyatli tizimga kirdingiz!", 1300)
        } else {
            setErrortext(postResult.msg)
        }
    };

    return (
        <SafeAreaView style={styles.mainBody}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <Loader loading={loading} />
            <View style={{ backgroundColor: "white" }}>
                <KeyboardAvoidingView enabled style={{ backgroundColor: 'white' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require("../../public/images/login.png")}
                            style={{
                                width: '50%',
                                height: 100,
                                resizeMode: 'contain',
                                margin: 30,
                            }}
                        />
                    </View>
                    <InputBase
                        placeholder="Loginni kiriting"
                        value={userLogin}
                        setValue={setUserLogin}
                        type='next'
                    />
                    <InputBase
                        placeholder="Parolni kiriting"
                        value={userParol}
                        setValue={setUserParol}
                        type='next'
                    />
                    {errortext != '' ? (
                        <Text style={styles.errorTextStyle}>
                            {errortext}
                        </Text>
                    ) : null}
                    <Pressable
                        style={{ ...submitBtn.btn, padding: 13 }}
                        onPress={handleSubmit}>
                        <Text style={submitBtn.text}>Tizimga kirish</Text>
                    </Pressable>

                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};
export default LoginScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignContent: 'center',
        paddingLeft: 35,
        paddingRight: 35
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});