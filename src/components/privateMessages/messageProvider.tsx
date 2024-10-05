import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";

import { IMessages, IModalPosition } from "../../types/messages";
import { dateToString } from "../../utils/functions";
import { colors } from "../../utils/variables";
import TextMessages from "./textMessages";
import FileMessages from "./fileMessages";
import VoiceMessages from "./voiceMessages";
import { useDispatch } from "react-redux";
import { addAsReadQueue } from "../../store/reducers/messages";
import Icon from "../../icons";
import { Flex } from "../../utils/globalStyles";

type Props = {
    current_user_id: number,
    setModalVisible: Dispatch<SetStateAction<boolean>>,
    setModal: Dispatch<SetStateAction<IModalPosition | undefined>>
} & IMessages

const MessageProvider = ({ text, read, file, voice, date, id, sender_user_id, user_id, current_user_id, setModalVisible, setModal }: Props) => {
    const messageIsFromSlef: boolean = Number(current_user_id) === Number(sender_user_id);
    const dispatch = useDispatch();

    const onPress = (e: any) => {
        setModal({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY, id, text, user_id });
        setModalVisible(true);
    }
    const onLayot = () => {
        if (!read) {
            if (Number(user_id) === Number(current_user_id)) {
                dispatch(addAsReadQueue(id));
            }
        }
    }

    const messageIsRead = (): ReactElement => {
        try {
            if (Number(sender_user_id) === Number(current_user_id)) {
                return read ? <View style={{ width: 10, height: 14, top: -5, marginLeft: 5, ...Flex.row }}>
                    <Icon name="done" />
                    <View style={{ width: 10, height: 14, marginLeft: -5 }}>
                        <Icon name="done" />
                    </View>
                </View> : <View style={{ width: 10, height: 14, top: -5, marginLeft: 5, ...Flex.row }}>
                    <Icon name="done" />
                </View>
            }
            return <></>
        } catch {
            return <></>
        }
    }
    return (
        <Pressable onLayout={onLayot} onPress={onPress} style={{ ...styles.wrapper, alignSelf: messageIsFromSlef ? "flex-end" : "flex-start" }}>
            <View style={{ ...styles.messageContainer, backgroundColor: messageIsFromSlef ? '#E1FEC6' : "white", }}>
                {
                    text ? (
                        <TextMessages text={text} />
                    ) : file ? (
                        <FileMessages file={file} />
                    ) : voice ? (
                        <VoiceMessages voice={voice} />
                    ) : (
                        <></>
                    )
                }
                <View style={styles.dateWrapper}>
                    <Text style={styles.date}>
                        {dateToString(date)}
                    </Text>
                    {messageIsRead()}
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        padding: 5,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 10,
        paddingTop: 5,
        paddingBottom: 0,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minWidth: 130
    },
    dateWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row",
        position: "relative",
        height: 14,
        padding: 0,
    },
    date: {
        color: colors.black,
        fontSize: 12,
        top: -5,
        lineHeight: 14
    }
})
export default MessageProvider