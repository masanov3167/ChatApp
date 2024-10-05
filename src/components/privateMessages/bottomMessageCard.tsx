import React, { Dispatch, LegacyRef, SetStateAction, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View, TextInput, Text, Animated, Easing, PermissionsAndroid, Linking, Vibration, Alert } from "react-native";
import DocumentPicker from "react-native-document-picker";
import Toast from "react-native-simple-toast"
import { Flex } from "../../utils/globalStyles";
import { SocketContext } from "../../context";
import { IMessages } from "../../types/messages";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import RNFetchBlob from "rn-fetch-blob";
import { poster, putter, socketEmit } from "../../utils/api";
import { RootStackParams } from "../../navigator/rootStackParams";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { colors, variables } from "../../utils/variables";
import Icon from "../../icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { chengeEdit } from "../../store/reducers/messages";
import { addCurrentChatMessages, updateCurrentChatMessages } from "../../store/reducers/users";
import { IUser } from "../../types/user";

type Props = {
    user_id: number,
    navigation: DrawerNavigationProp<RootStackParams, 'privateMessages'>;
}
type newMessageData = {
    data: IMessages,
    chat?: IUser
}
type newMessageProps = {
    data: IMessages,
    chat?: boolean
}
const BottomMessageCard = ({ user_id, navigation }: Props) => {
    const socket = useContext(SocketContext);
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
    const audio = audioRecorderPlayer.current;
    const [isRecording, setIsRecording] = useState<0 | 1 | 2>(0);
    const [audioName, setAudioName] = useState<string>(Date.now().toString());
    const [text, setText] = useState<string>("");
    const [duration, setDuration] = useState<string>("")
    const { user, chats } = useSelector((state: RootState) => state.userSlice);
    const { editText } = useSelector((state: RootState) => state.messageSlice)
    const inputRef = useRef<TextInput>(null);
    const dispatch = useDispatch();

    const getChat = (): boolean => {
        try {
            const find = chats.find(ch => ch.id == user_id);
            return !Boolean(find)
        } catch {
            return false
        }
    }

    useEffect(() => {
        dispatch(chengeEdit());
    }, []);

    const sendMessage = async () => {
        if (user) {
            if (editText) {
                const result = await socketEmit("update-text-message", editText);
                if (result.ok && result.data) {
                    dispatch(updateCurrentChatMessages(result.data as IMessages))
                    dispatch(chengeEdit());
                } else {
                    Toast.show(result.msg, 1000);
                    dispatch(chengeEdit());
                }
                return
            }
            const newMessage = {
                sender_user_id: user.id,
                user_id,
                text: text.trim()
            }
            const result = await socketEmit<newMessageData, any>("new-message", { data: newMessage, chat: getChat() });
            console.log(result);

            if (result.ok && result.data) {
                dispatch(addCurrentChatMessages(result.data))
            } else {
                Toast.show(result.msg, 700)
            }
            setText("")
        }
    }

    const sendVoice = async () => {
        const permissions = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ]);
        const storagePermission = permissions[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        const microphonePermission = permissions[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]
        const readStoragePermission = permissions[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]
        const granted = PermissionsAndroid.RESULTS.GRANTED;
        const keys = [
            { key: storagePermission, text: "Media yozishga ruhsat bering" },
            { key: readStoragePermission, text: "Media o'qishga ruhsat bering" },
            { key: microphonePermission, text: "Mikrofonga ruhsat bering" },
        ];

        keys.map((k) => {
            if (k.key !== granted) {
                Toast.show(k.text, 1000);
            }
        })

        const filteredKeys = keys.filter((k) => k.key === granted);

        if (filteredKeys.length === 3) {
            setIsRecording((old) => (old === 0 ? 1 : old === 1 ? 2 : 0));
        } else {
            Alert.alert("Permission denied", "Ilovadan to'liq foydalanish uchun iltimos biz so'ragan barcha ruhsatlarni bering",
                [
                    { text: "Yopish" },
                    { text: "Ruhsat berish", onPress: () => Linking.openSettings() },
                ]
            )
        }
    }

    useEffect(() => {
        (async () => {
            const path = `${variables.casheDir}/${audioName}.acc`;
            if (isRecording === 1) {
                const isFileExists = await RNFetchBlob.fs.exists(path);
                if (!isFileExists) {
                    await RNFetchBlob.fs.createFile(path, "", "utf8").catch(e => e)
                }
                await audio.startRecorder(path, variables.audioSet);
                audio.addRecordBackListener(e => {
                    setDuration(audio.mmssss(e.currentPosition));
                });
                Vibration.vibrate(200);
            }
            if (isRecording === 2) {
                const recordedAudioPath = await audio.stopRecorder().catch(() => null);
                audio.removeRecordBackListener();
                setIsRecording(0);
                if (recordedAudioPath) {
                    let fd = new FormData();
                    const audioFile = {
                        uri: recordedAudioPath,
                        name: `${audioName}.aac`,
                        type: 'audio/aac',
                    };
                    fd.append('voice', audioFile);
                    fd.append("duration", duration);
                    const result = await poster<IMessages, FormData>(`messages/voice?chat_id=${user_id}`,
                        {
                            data: fd,
                            json: false
                        },
                        navigation,

                    );

                    if (result.ok && result.data) {
                        setAudioName(Date.now().toString());
                        setDuration("0");
                        const data = await socketEmit<newMessageData, newMessageProps>("new-voice-message", { data: result.data, chat: getChat() })
                        if (data.ok && data.data) {
                            dispatch(addCurrentChatMessages(data.data))
                        }
                    } else {
                        Toast.show(result.msg, 500);
                    }
                }
            }
        })()
    }, [isRecording]);

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
            }).catch(() => undefined);

            if (response?.length) {
                let fd = new FormData();
                const { uri, name, type } = response[0];
                const file = { uri, name, type }
                fd.append('file', file);
                const result = await poster<IMessages, FormData>(`messages/file?chat_id=${user_id}`,
                    {
                        data: fd,
                        json: false
                    },
                    navigation,
                );
                if (result.ok && result.data) {
                    const data = await socketEmit<newMessageData, newMessageProps>("new-file-message", { data: result.data, chat: getChat() });
                    if (data.ok && data.data) {
                        dispatch(addCurrentChatMessages(data.data));
                    }
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }, []);


    useEffect(() => {
        if (editText?.user_id) {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }
    }, [editText])

    return (
        <View style={styles.main}>
            <View style={{ ...Flex.row, ...styles.wrapper }}>
                <Pressable style={{ width: 27, height: 27 }} onPress={handleDocumentSelection}>
                    <Icon name="pluscircle" />
                </Pressable>
                <View style={styles.i}>
                    <TextInput
                        ref={inputRef}
                        multiline
                        autoCapitalize="none"
                        keyboardType="default"
                        returnKeyType="done"
                        autoCorrect={true}
                        style={styles.input}
                        autoFocus
                        placeholder="Habarni yozing"
                        onChangeText={(txt) => {
                            editText?.id ? dispatch(chengeEdit({ ...editText, text: txt })) : setText(txt)
                        }}
                        value={editText?.id ? editText.text : text}
                        blurOnSubmit={false}
                        placeholderTextColor={colors.tgWhite}
                    />
                </View>
                {
                    isRecording === 1 && (
                        <View style={styles.recordWrapper}>
                            <Text style={{ color: colors.black }}>{duration}</Text>
                        </View>
                    )
                }
                {
                    isRecording !== 1 && text && text.trim().length > 0 || isRecording !== 1 && editText?.text && editText?.text.trim().length > 0 ? (
                        <Pressable onPress={sendMessage} style={{ width: editText?.text ? 22 : 27, height: editText?.text ? 22 : 27, ...Flex.row }}>
                            <Icon light name={editText?.text ? "done" : "send"} />
                        </Pressable>
                    ) : (
                        <Pressable onLongPress={sendVoice} onPress={sendVoice} style={{ width: 27, height: 27, ...Flex.row }}>
                            <Icon name="microphone" light={isRecording === 0} />
                        </Pressable>
                    )
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: "100%",
        maxHeight: 200,
        position: "absolute",
        bottom: 0,
        backgroundColor: "white"
    },
    wrapper: {
        padding: 10,
        paddingBottom: 15,
        paddingTop: 15,
        alignItems: "flex-end",
    },
    i: {
        width: "86%",
    },
    input: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 17,
        textAlign: "auto",
        padding: 0,
        height: "100%",
        color: colors.black
    },
    recordWrapper: {
        zIndex: 2,
        backgroundColor: "white",
        position: "absolute",
        width: "93%",
        height: 60,
        left: 0,
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        padding: 5,
        paddingLeft: 20
    },
})

export default BottomMessageCard