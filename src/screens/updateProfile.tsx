import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Toast from "react-native-simple-toast"

import { RootStackParams } from '../navigator/rootStackParams';
import { submitBtn } from '../utils/globalStyles';
import InputBase from '../components/updateProfile/inputBase';
import { putter } from '../utils/api';
import { navigateReset } from '../utils/functions';
import CenterText from '../components/reusable/centerText';
import { IEditUser, IUserWithToken } from '../types/user';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { userStorage } from '../mmkv/storage';
import MainContainer from './mainContainer';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<RootStackParams, 'updateProfile'>;
const UpdateProfileScreen = ({ navigation }: Props) => {
    const { user } = useSelector((state: RootState) => state.userSlice);
    const [name, setName] = useState<string>("")
    const [phone, setPhone] = useState<string>(user?.phone ?? "")
    const [login, setLogin] = useState<string>(user?.login ?? "")
    const [parol, setParol] = useState<string>("");
    const [load, setLoad] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>()


    useEffect(() => {
        if (user) {
            setName(user.name)
            setPhone(user.phone)
            setLogin(user.login)
        }
    }, [user])

    const handleSubmit = async () => {
        setLoad(true)
        const body: IEditUser = {
            name,
            login,
            parol,
            phone
        }
        const data = await putter<IUserWithToken, IEditUser>(`users/update`,
            {
                data: body,
                json: true
            },
            navigation
        )
        if (data.ok && data.data) {
            userStorage.set("token", data.data.token);
            setErrorText("")
            Toast.show("Muvaffaqiyatli yangilandi!", 1300)
            goHome()
        } else {
            setErrorText(data?.msg)
        }

        setLoad(false)
    }

    const goHome = () => {
        navigateReset(navigation, "home")
    }

    return (
        <MainContainer navigation={navigation}>
            {
                user ? (
                    <>
                        <ScrollView style={styles.mainWrapper}>
                            <InputBase value={name} setValue={setName} label="Ism" />
                            <InputBase value={phone} setValue={setPhone} label="Telefon raqam" />
                            <InputBase value={login} setValue={setLogin} label="Login" />
                            <InputBase value={parol} setValue={setParol} label="Parol" done />
                            <View>
                                {
                                    errorText && <Text style={styles.errorText}>{errorText}</Text>
                                }
                            </View>
                            <Pressable style={submitBtn.btn} disabled={load} onPress={handleSubmit}>
                                <Text style={{ ...submitBtn.text, opacity: load ? 0.8 : 1 }}> {`Yangila${load ? "nmoqda..." : "sh"}`} </Text>
                            </Pressable>
                        </ScrollView>
                    </>
                ) : (
                    <CenterText txt="Yuklanmoqda..." />
                )
            }
        </MainContainer>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        padding: 15,
        backgroundColor: "white"
    },
    errorText: {
        marginTop: 5,
        marginBottom: 5,
        color: "red"
    }
})

export default UpdateProfileScreen;