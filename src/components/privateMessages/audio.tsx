import React, { useState, useRef } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    Platform,
    PermissionsAndroid
} from 'react-native';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    OutputFormatAndroidType,
    PlayBackType,
    RecordBackType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import { poster } from '../../utils/api';
import { RootStackParams } from '../../navigator/rootStackParams';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type Props = {
    nav: DrawerNavigationProp<RootStackParams, any>
}

const Page = ({ nav }: Props) => {
    const [status, setStatus] = useState<string>("record")

    const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
    audioRecorderPlayer.current.setSubscriptionDuration(15); // optional. Default is 0.5

    const dirs = RNFetchBlob.fs.dirs;

    // Your path definition...
    const path1 = Platform.select({
        ios: 'hello.m4a',
        android: `${dirs.CacheDir}/hello.aac`,
    });
    const path = async () => {
        const isFileExists = await RNFetchBlob.fs.exists(path1 as string);
        if (!isFileExists) {
            const loaction = RNFetchBlob.fs.dirs.CacheDir
            const nima = await RNFetchBlob.fs.createFile(`${loaction}/hello.aac`, "", "utf8").catch(e => e)
            console.log(nima);
        }
        return path1 as string
    }


    const onStartRecord = async () => {
        setStatus("recording...")
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);

                console.log('write external stroage', grants);

                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('permissions granted');
                } else {
                    console.log('All required permissions not granted');

                    return;
                }
            } catch (err) {
                console.warn(err);

                return;
            }
        }

        const audioSet: AudioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
            OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
        };

        const uri = await audioRecorderPlayer.current.startRecorder(
            path1,
            audioSet,
        );
    };

    const onStopRecord = async () => {
        setStatus("recorded")
        await audioRecorderPlayer.current.stopRecorder().then(async (d) => {
            let fd = new FormData();
            const audioFile = {
                uri: d, // Faylning uri manzili (file:// jihatidan)
                name: 'hello.aac', // Fayl nomi
                type: 'audio/aac', // Fayl turi
            };

            fd.append('voice', audioFile);
            const result = await poster<any, FormData>(`messages/voice?chat_id=2`,
                {
                    data: fd,
                    json: false
                },
                nav
            );
            console.log(result);


        });
        audioRecorderPlayer.current.removeRecordBackListener();

    };

    const onStartPlay = async () => {
        setStatus("record playing...")
        try {
            await audioRecorderPlayer.current.startPlayer(path1);
        } catch (err) {
            console.log('startPlayer error', err);
        }
    };

    const onStopPlay = async () => {
        setStatus("record")
        audioRecorderPlayer.current.stopPlayer();
        audioRecorderPlayer.current.removePlayBackListener();
    };

    const onSubmit = async () => {
        const formData = new FormData();

        formData.append('voice', {
            uri: `file://${path1}`,
            name: "hello.aac"
        });

        const result = await poster<any, FormData>(`messages/voice?chat_id=2`,
            {
                data: formData,
                json: false
            },
            nav,
        );
        console.log(result);
    }
    return (
        <SafeAreaView >
            <Text >Audio Recorder Player</Text>
            <View >
                <View >
                    <Pressable
                        onPress={onStartRecord}
                    >
                        <Text>Record</Text>
                    </Pressable>
                    <Pressable
                        onPress={onStopRecord}
                    >
                        <Text>Stop</Text>
                    </Pressable>

                </View>
            </View>
            <View >

                <View>
                    <Text>{status}</Text>
                </View>
                <View >
                    <Pressable
                        onPress={onStartPlay}
                    >
                        <Text>Play</Text>
                    </Pressable>

                    <Pressable
                        onPress={onStopPlay}
                    >
                        <Text>Stop</Text>
                    </Pressable>

                    <Pressable
                        onPress={onSubmit}
                    >
                        <Text>load to backend</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Page;
