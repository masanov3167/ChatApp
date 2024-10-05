import { decode as base64Decode } from 'base-64';
import { RootStackParams } from '../navigator/rootStackParams';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import RNFetchBlob from 'rn-fetch-blob';
import { variables } from './variables';
import Toast from "react-native-simple-toast";
import path from "path";

export const jwtDecoder = (token: string): { header: any, payload: any } | null => {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
        return null; 
    }

    const [headerB64, payloadB64] = parts;

    try {
        const header = JSON.parse(base64Decode(headerB64));
        const payload = JSON.parse(base64Decode(payloadB64));
        return { header, payload };
    } catch (error) {
        console.log(error);
        return null; 
    }
}

export const dateToString = (date: Date) : string =>{
    try{
        const result = new Date(date).toLocaleString("en-US", {
            timeZone: 'Asia/Tashkent',
            year: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            month:"numeric",
            hour12: false
        });
        
        return result.split("/").join(".").substring(0,result.lastIndexOf(":"))
    }
    catch(e){        
        return String(e)
    }
}

export const fileSize = (sizeInBytes: number):  string => {
    if (sizeInBytes < 1024) return sizeInBytes + ' B';

    if (sizeInBytes < 1024 * 1024) return (sizeInBytes / 1024).toFixed(2) + ' KB';
      
    if (sizeInBytes < 1024 * 1024 * 1024) return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';

    return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' TB';
  }

export const navigateReset = (navigation: DrawerNavigationProp<RootStackParams, any>, name: string) => {
    navigation.reset({
        index: 0,
        routes: [{ name: name as keyof RootStackParams }],
    });
}
export const donwloadFile = async(name: string, url: string, actionHide?: boolean): Promise<boolean> =>{
    try{
        
        const filePath =  variables.downDir + `/${name}`
      const result =  RNFetchBlob.config({
            addAndroidDownloads: {
                useDownloadManager: true,
                title: name,
                description: `${name} yuklanmoqda`,
                notification: true,
                mediaScannable: true,
                path: filePath
            }
        })
            .fetch('GET', `${variables.baseUrl}/messages/down/${url}`)
            .then(() => {
                if(!actionHide){
                    Toast.show(`${name} muvaffaqiyatli yuklab olindi`, 700);
                }
                return true
            })
            .catch((err) => {
                Toast.show(`${name} yuklashda xatolik: ${String(err)}`, 700);
                return false
            });
            return result
    }catch(err){
        Toast.show(`${name} yuklashda xatolik: ${String(err)}`, 700);
        return false
    }
}

export const fileExists = async(name:string) =>{
    try{
        const result = await RNFetchBlob.fs.exists(variables.downDir + `/${name}`);
        return result
    }catch{
        return false
    }
}