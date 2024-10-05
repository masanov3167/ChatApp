import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

import NavItem from './navItem';
import { Flex } from '../../utils/globalStyles';
import UserPic from '../reusable/userPic';
import { colors } from '../../utils/variables';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';

type Props = {
    navigation: DrawerNavigationHelpers;
};


const CustomDrawerContent = ({ navigation }: Props) => {
    const { user } = useSelector((state: RootState) => state.userSlice);
    return (
        <DrawerContentScrollView style={{ backgroundColor: "white", marginTop: -4 }}>
            <View style={styles.heroWrapper}>
                {
                    user && (
                        <>
                            <UserPic txt={user.name} disableStatus />
                            <View style={styles.heroRight}>
                                <View>
                                    <Text style={styles.userName}>{user.name}</Text>
                                </View>
                                <View><Text style={styles.userPhone}>{user.phone}</Text></View>
                            </View>
                        </>
                    )
                }
            </View>
            <View style={styles.mainWrapper}>
                <NavItem iconName='settings' txt="Ma'lumotlarni yangilash" route="updateProfile" navigation={navigation} />
                <NavItem iconName='contacts' txt="Kontaktlar" route="contact" navigation={navigation} />
                <NavItem iconName='delete' txt="Profildan chiqish" route="login" navigation={navigation} logOut />
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    heroWrapper: {
        ...Flex.row,
        padding: 15,
        backgroundColor: colors.blue,
        justifyContent: "flex-start"
    },
    heroRight: {
        marginLeft: 10
    },
    userName: {
        fontWeight: "700",
        fontSize: 17
    },
    userPhone: {
        fontWeight: "600",
        fontSize: 12
    },
    mainWrapper: {
        ...Flex.row,
        alignItems: "flex-start",
        flexDirection: "column",
        padding: 15,
        backgroundColor: "white"
    }
})

export default CustomDrawerContent