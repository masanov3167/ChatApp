import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { IVoiceMessages } from "../../types/messages";
import { colors, variables } from "../../utils/variables";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { donwloadFile, fileSize } from "../../utils/functions";
import Icon from "../../icons";
import { Flex } from "../../utils/globalStyles";
import RNFetchBlob from "rn-fetch-blob";
import Toast from "react-native-simple-toast";

type Props = {
    voice: IVoiceMessages,
}

const VoiceMessages = ({ voice }: Props) => {
    const [played, setPlayed] = useState<boolean>(false);
    const [currentPositionSec, setCurrentPositionSec] = useState(0);
    const [currentDurationSec, setCurrentDurationSec] = useState(4);
    const [playTime, setPlayTime] = useState<string>("0");
    const [duration, setDuration] = useState<string>("0");
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

    const onStartPlay = async () => {
        if (voice?.path) {
            const fileName = voice.path.split("/")[2];
            const filePath = variables.downDir + "/" + fileName;
            const isExist = await RNFetchBlob.fs.exists(filePath);
            if (!isExist) {
                const result = await donwloadFile(fileName, voice.path, true);
                if (!result) return Toast.show("Ovozli habarni yuklashda muammo", 700);
                await playerStart(filePath);
            } else {
                await playerStart(filePath);
            }
        }
    };

    const playerStart = async (url: string) => {
        setPlayed(true);
        await audioRecorderPlayer.startPlayer(url).catch(e => {
            console.log(e);
            return e
        });
        audioRecorderPlayer.addPlayBackListener(e => {
            if (e.currentPosition < 0) {
                return;
            }
            setCurrentPositionSec(e.currentPosition);
            setCurrentDurationSec(e.duration);
            setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
            setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

            if (Number(e.currentPosition) === Number(e.duration)) {
                onStopPlay();
            }
            return;
        });
    }

    const onStopPlay = async () => {
        setPlayed(false);
        setCurrentPositionSec(0);
        setPlayTime("0");
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
    };

    return (
        <View style={styles.wrapper}>
            <Pressable onPress={() => played ? onStopPlay() : onStartPlay()} style={styles.border}>
                {
                    played ? (
                        <Icon name="pause" />
                    ) : (
                        <Icon name="play" />
                    )
                }
            </Pressable>
            <View >
                <View style={{ ...styles.wave, width: voice.size / 500, minWidth: 160 }}>
                    <Text style={styles.waveBg}></Text>
                    <Text style={{ ...styles.waveOn, width: `${(currentPositionSec / currentDurationSec) * 100}%` }}></Text>
                </View>
                <View style={{ ...Flex.row }}>
                    <View >
                        <Text style={styles.text}>
                            {
                                played ? (
                                    `${playTime} - ${duration}`
                                ) : (
                                    `${voice.duration}, ${fileSize(voice.size)}`
                                )
                            }
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 5
    },
    text: {
        fontSize: 11,
        color: colors.black
    },
    border: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        width: 30,
        height: 30
    },
    wave: {
        maxWidth: 200,
        height: 5,
        borderRadius: 10,
    },
    waveBg: {
        position: "absolute",
        zIndex: 1,
        borderRadius: 10,
        backgroundColor: colors.tgWhite,
        width: "100%",
        height: 5,
        opacity: 0.5,
        maxWidth: "100%"
    },
    waveOn: {
        backgroundColor: colors.tgWhite,
        zIndex: 2,
        borderRadius: 10,
        width: 30,
        maxWidth: "100%"
    }
})
export default VoiceMessages