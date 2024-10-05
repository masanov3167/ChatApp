import { IMessages } from "./messages"
import { IUser } from "./user"

export type IChat = {
    messages: IMessages[]
} & IUser