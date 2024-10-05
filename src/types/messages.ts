export type IMessages = {
    id: number,
    sender_user_id: number,
    user_id: number,
    date: Date,
    read:boolean,
    text?: string,
    voice?: IVoiceMessages,
    file?:IFileMessages
}

export type IVoiceMessages = {
    size: number,
    path: string,
    duration: string
}
export type IFileMessages = {
    name: string,
    path:string,
    size: string
}

export type IModalPosition = {
    x:number,
    y:number,
    id: number,
    text?:string,
    user_id: number
}

export type readedMessage = {id:number, chat_id:number};