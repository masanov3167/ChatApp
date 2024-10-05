import { AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSourceAndroidType, OutputFormatAndroidType } from "react-native-audio-recorder-player";
import RNFetchBlob from "rn-fetch-blob";

const dirs = RNFetchBlob.fs.dirs;
export const variables = {
    baseUrl : "https://chat.madeira.uz",
    socketUrl: "ws://89.223.120.37:5000",
    casheDir: dirs.CacheDir,
    docDir: dirs.DocumentDir,
    downDir: dirs.DownloadDir,
    audioSet: {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    }
}

export const colors = {
    blue: "#1282cc",
    lightBlue:"#34a4eb",
    submitBtn: "#242760",
    lightBlack: "#737573",
    tgWhite:"#868686",
    black: "#000000"
}

