import { ReactElement } from "react"
import { DeleteRed, Edit, Settings, User, Cancel, Search } from "./home"
import { Done, Download, File, Microphone, Pause, Play, PlusCircle, Send, } from "./message";

type IIcon = {
    name: string,
    light?: ReactElement,
    default: ReactElement,
}

const icons: IIcon[] = [
    { name: "contacts", light: <User light />, default: <User /> },
    { name: "edit", light: <Edit light />, default: <Edit /> },
    { name: "settings", light: <Settings light />, default: <Settings /> },
    { name: "search", light: <Search light />, default: <Search /> },
    { name: "cancel", light: <Cancel light />, default: <Cancel /> },
    { name: "play", light: <Play light />, default: <Play /> },
    { name: "pause", light: <Pause light />, default: <Pause /> },
    { name: "delete", default: <DeleteRed /> },
    { name: "download", default: <Download /> },
    { name: "microphone", default: <Microphone />, light: <Microphone light /> },
    { name: "pluscircle", default: <PlusCircle /> },
    { name: "send", default: <Send /> },
    { name: "file", default: <File /> },
    { name: "done", default: <Done />, light: <Done light /> },
];

export type IIconPropsName = "done" | "file" | "play" | "pause" | "contacts" | "edit" | "delete" | "settings" | "download" | "microphone" | "pluscircle" | "send" | "search" | "cancel"

type Props = {
    name: IIconPropsName,
    light?: boolean
}
const Icon = ({ name, light }: Props): ReactElement => {
    const findIcon = icons.find(i => i.name === name);
    if (!findIcon) {
        return <></>
    }
    return light && findIcon.light ? findIcon.light : findIcon.default
}

export default Icon;