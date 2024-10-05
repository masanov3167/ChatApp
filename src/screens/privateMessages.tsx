import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { RootStackParams } from '../navigator/rootStackParams';
import BottomMessageCard from '../components/privateMessages/bottomMessageCard';
import { IModalPosition, readedMessage } from '../types/messages';
import { SocketContext } from '../context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import MessageModal from '../components/modal';
import MessageProvider from '../components/privateMessages/messageProvider';
import { changeContentIgnore, clearAsReadQueue } from '../store/reducers/messages';
import { colors } from '../utils/variables';
import { updateChats } from '../store/reducers/users';
import { socketEmit } from '../utils/api';

type Props = {
    route: RouteProp<RootStackParams, "privateMessages">;
    navigation: DrawerNavigationProp<RootStackParams, 'privateMessages'>;
};
const PrivateMessages = ({ route, navigation }: Props) => {
    const { user: selectedUser, message_id_for_view } = route.params;
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modal, setModal] = useState<IModalPosition>();
    const { id } = selectedUser
    const socket = useContext(SocketContext)
    const { user, chats } = useSelector((state: RootState) => state.userSlice);
    const { ignoreChangeContent, asReadQueue } = useSelector((state: RootState) => state.messageSlice)
    const dispatch = useDispatch();
    const currentChatMessages = chats.find(ch => Number(ch.id) === Number(selectedUser.id))?.messages ?? []

    const viewRef = React.useRef<ScrollView>(null)
    const [contentHeight, setContentHeight] = useState<number>();
    useEffect(() => {
        if (!ignoreChangeContent) {
            viewRef.current?.scrollTo({ y: contentHeight, animated: true });
        } else {
            dispatch(changeContentIgnore(false))
        }
    }, [contentHeight]);



    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            (async () => {
                if (asReadQueue.length) {
                    const result = await socketEmit<readedMessage[], number[]>("read-message", asReadQueue);
                    if (result.ok && result.data) {
                        dispatch(clearAsReadQueue());
                        dispatch(updateChats(result.data))
                    }
                }
            })()
        }, 1000)
        return () => clearTimeout(delayDebounce)
    }, [asReadQueue])

    console.log(currentChatMessages);


    return (
        <View style={styles.main}>
            {message_id_for_view && <Text>Message ID for View: {message_id_for_view}</Text>}
            <MessageModal user_id={modal?.user_id ?? 0} text={modal?.text} nav={navigation} modalVisible={modalVisible} setModalVisible={setModalVisible} x={modal?.x ?? 0} y={modal?.y ?? 0} id={modal?.id ?? 0} />
            <ScrollView
                ref={viewRef}
                style={{ marginBottom: 60, marginTop: 3 }}
                onContentSizeChange={(_, h) => setContentHeight(h)}
            >
                {
                    user && (
                        currentChatMessages.length ? (
                            currentChatMessages.map((e, ind) => (
                                <MessageProvider
                                    setModal={setModal}
                                    setModalVisible={setModalVisible}
                                    current_user_id={user.id}
                                    {...e}
                                    key={ind}
                                />
                            ))
                        ) : (
                            <Text style={{ color: colors.tgWhite, textAlign: "center" }}>Hali yozishmalar yo'q</Text>
                        )
                    )
                }

            </ScrollView>
            <BottomMessageCard user_id={id} navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "whitesmoke"
    }
})

export default PrivateMessages;
