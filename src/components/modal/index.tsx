import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../utils/variables";
import ModalItem from "./modalItem";
import { IMessages, IModalPosition } from "../../types/messages";
import { deleter, socketEmit } from "../../utils/api";
import { RootStackParams } from "../../navigator/rootStackParams";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Toast from "react-native-simple-toast";
import { useDispatch } from "react-redux";
import { changeContentIgnore, chengeEdit } from "../../store/reducers/messages";
import { deleteCurrentChatMessages } from "../../store/reducers/users";

type Props = {
    modalVisible: boolean,
    setModalVisible: Dispatch<SetStateAction<boolean>>,
    nav: DrawerNavigationProp<RootStackParams, any>,
} & IModalPosition
const dimensions = Dimensions.get('window');
const MessageModal = ({ modalVisible, setModalVisible, x, y, id, user_id, nav, text }: Props) => {
    const dispatch = useDispatch();

    const modalWidth = 175;
    const modalHeight = text ? 160 : 80;
    const leftX = Number(x ?? 0);
    const leftY = Number(y ?? 0);
    const leftPosition = dimensions.width - leftX >= modalWidth ? leftX : dimensions.width - modalWidth;
    const topPosition = dimensions.height - leftY >= modalHeight ? leftY : dimensions.height - modalHeight;

    const onDelete = async () => {
        setModalVisible(false);
        const result = await socketEmit("delete-message", { id })
        if (result.ok && result.data) {
            Toast.show(result.msg, 700);
            dispatch(changeContentIgnore(true))
            dispatch(deleteCurrentChatMessages(id));
        } else {
            Toast.show(result.msg, 700);
        }
    }
    const onEdit = () => {
        setModalVisible(false);
        if (text) {
            dispatch(chengeEdit({ text, id, user_id }));
        } else {
            Toast.show("soon...", 700);
        }
    }
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <Pressable
                style={styles.backdrop}
                onPress={() => setModalVisible(!modalVisible)}
            >
                <View style={{
                    backgroundColor: "azure",
                    width: modalWidth - 5,
                    left: leftPosition,
                    top: topPosition,
                    borderRadius: 5
                }}>
                    {
                        text && <ModalItem txt="Tahrirlash" iconName="edit" onPress={onEdit} />
                    }
                    <ModalItem txt="O'chirish" iconName="delete" onPress={onDelete} />
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})

export default MessageModal