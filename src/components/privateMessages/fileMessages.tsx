import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { IFileMessages } from "../../types/messages";
import { donwloadFile, fileExists, fileSize } from "../../utils/functions";
import { Flex } from "../../utils/globalStyles";
import Icon from "../../icons";
import Toast from "react-native-simple-toast"
import { colors } from "../../utils/variables";

type Props = {
    file: IFileMessages,
}

const FileMessages = ({ file }: Props) => {
    const [isDl, setIsDl] = useState<boolean>(false);

    const onDownload = async () => {
        if (file) {
            const downloaded = await donwloadFile(file?.name, file?.path);
            setIsDl(downloaded);
        }
    }

    const onOpen = async () => {
        Toast.show("Fayl menejer orqali ko'ring", 700);
    }
    useEffect(() => {
        (async () => {
            const isFileExists = await fileExists(file?.name ?? "");
            if (isFileExists) {
                setIsDl(true)
            }
        })()
    }, [])

    return (
        <View style={styles.wrapper}>
            <View style={styles.icon}>
                <Pressable style={{ width: 20, height: 20, display: "flex", justifyContent: "center", alignItems: "center" }} onPress={() => isDl ? onOpen() : onDownload()}>
                    <Icon name={isDl ? "file" : "download"} />
                </Pressable>
            </View>
            <View>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{file?.name}</Text>
                <View style={{ ...Flex.row, minWidth: 120 }}>
                    <Text style={{ color: colors.black, fontSize: 11, opacity: 0.9 }}>{fileSize(Number(file?.size) ?? 0)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row"
    },
    text: {
        fontSize: 18,
        maxWidth: 230,
        minWidth: 100,
        overflow: "hidden",
        color: colors.black,
        opacity: 0.7
    },
    icon: {
        padding: 10,
        marginRight: 5,
        borderRadius: 50,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})
export default FileMessages