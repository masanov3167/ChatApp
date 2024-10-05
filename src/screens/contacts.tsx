import React from 'react';

import { RootStackParams } from '../navigator/rootStackParams';
import UserList from '../components/reusable/userList';

import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import MainContainer from './mainContainer';
import { DrawerScreenProps } from '@react-navigation/drawer';

type Props = DrawerScreenProps<RootStackParams, 'contact'>;
const ContactsScreen = ({ navigation }: Props) => {
    const { users } = useSelector((state: RootState) => state.userSlice);

    return (
        <MainContainer navigation={navigation}>
            <UserList
                users={users ?? []}
                navigation={navigation}
                onScreen="contact"
            />
        </MainContainer>
    );
};


export default ContactsScreen;