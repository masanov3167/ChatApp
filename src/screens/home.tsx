import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';

import { RootStackParams } from '../navigator/rootStackParams';
import { IUser } from '../types/user';
import { Flex, headerStyles } from "../utils/globalStyles"

import { SocketContext } from '../context';
import UserList from '../components/reusable/userList';
import NewMessageButton from '../components/home/newMessageButton';
import MainContainer from './mainContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Icon from '../icons';
import { colors } from '../utils/variables';


type Props = DrawerScreenProps<RootStackParams, any>
const HomeScreen = ({ navigation }: Props) => {
    const [searchText, setSearchText] = useState('');
    const [searchedUsers, setSearchedUsers] = useState<IUser[]>();
    const socket = useContext(SocketContext);

    const { chats } = useSelector((state: RootState) => state.userSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchUser(searchText)
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [searchText])

    const handleSearch = (text: string) => {
        searchUser(text)
    };

    const searchUser = (txt: string) => {
        if (chats && chats.length > 0) {
            const regex = new RegExp(txt, 'i');
            const filteredUsers = chats.filter(user => regex.test(user.name));
            setSearchedUsers(filteredUsers)
        }
    }

    return (
        <MainContainer navigation={navigation}>
            <View style={headerStyles.main}>
                <View style={searchBarStyles.main}>
                    <View style={searchBarStyles.inputWrapper}>
                        <Pressable onPress={() => handleSearch(searchText)} style={{ position: "absolute", left: 10, zIndex: 1, width: 15, height: 15 }}>
                            <Icon name="search" />
                        </Pressable>
                        <TextInput
                            style={searchBarStyles.input}
                            onChangeText={(text) =>
                                setSearchText(text)
                            }
                            placeholder="Izlash"
                            placeholderTextColor={colors.tgWhite}
                            autoCapitalize="none"
                            keyboardType="web-search"
                            returnKeyType="search"
                            value={searchText}
                            onSubmitEditing={() => handleSearch(searchText)}
                        />
                        {
                            searchText.length > 0 && <Pressable style={{ position: "absolute", right: 10, width: 13, height: 13 }} onPress={() => setSearchText("")}>
                                <Icon name="cancel" />
                            </Pressable>
                        }
                    </View>
                </View>
            </View>
            <UserList
                users={searchText.length > 0 ? searchedUsers ?? [] : chats ?? []}
                navigation={navigation}
                onScreen='home'
            />

            <NewMessageButton onPress={() => navigation.navigate("contact")} />
        </MainContainer>
    );
};

export default HomeScreen;


const searchBarStyles = StyleSheet.create({
    main: {
        ...Flex.row,
    },
    inputWrapper: {
        ...Flex.row,
        flex: 1,
        position: "relative",
        backgroundColor: "azure",
        borderRadius: 15
    },
    input: {
        flex: 1,
        padding: 10,
        paddingLeft: 35,
        paddingRight: 35,
        borderColor: "azure",
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: "azure",
        fontSize: 18,
        fontWeight: "600",
        color: colors.black
    },
    cancel: {
        fontWeight: "700",
        color: "white"
    }
})