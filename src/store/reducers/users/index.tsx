import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserWithToken } from "../../../types/user";
import { userStorage } from "../../../mmkv/storage";
import { jwtDecoder } from "../../../utils/functions";
import { IChat } from "../../../types/chat";
import { IMessages, readedMessage } from "../../../types/messages";



type State = {
    user?: IUserWithToken,
    users: IUser[],
    chats: IChat[],
};

const token = userStorage.getString("token");


const initialState: State = {
    user: token ? jwtDecoder(token)?.payload : undefined,
    users: [],
    chats: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginAction: (state, action: PayloadAction<IUserWithToken>) => {
            state.user = action.payload
            return state
        },
        logOutAction: (state) => {
            state.user = undefined
            return state
        },
        setUsers: (state, action: PayloadAction<{ users: IUser[] }>) => {
            state.users = action.payload.users;
            return state
        },
        addUser: (state, action: PayloadAction<IUser>) => {
            const user = action.payload
            state.users.unshift(user)
            return state
        },
        setChats: (state, action: PayloadAction<IChat[]>) => {
            state.chats = action.payload;
            return state
        },
        updateUserStatus: (state, action: PayloadAction<{ id: number, status: boolean }>) => {
            const user = action.payload
            const updated = state.chats.map((ch) => {
                if (Number(ch.id) === Number(user.id)) {
                    return {
                        ...ch,
                        isonline: user.status
                    }
                } else {
                    return ch
                }
            });
            const updatedUsers = state.users.map((u) => {
                if (Number(u.id) === Number(user.id)) {
                    return {
                        ...u,
                        isonline: user.status
                    }
                } else {
                    return u
                }
            });
            state.users = updatedUsers
            state.chats = updated;
            return state
        },
        deleteCurrentChatMessages: (state, action: PayloadAction<number>) => {
            state.chats.forEach((chat) => {
                const message = chat.messages.find(m => Number(m.id) === Number(action.payload));
                if (message) {
                    const chat = state.chats.find(c => Number(c.id) === Number(message.sender_user_id) || c.id === Number(message.user_id));
                    if (chat) {
                        const filter = chat.messages.filter(ch => Number(ch.id) !== Number(message.id));
                        const updated = state.chats.map(ch => {
                            if (Number(ch.id) === Number(message.sender_user_id) || Number(ch.id) === Number(message.user_id)) {
                                return {
                                    ...ch,
                                    messages: filter
                                }
                            } else {
                                return ch
                            }
                        });
                        state.chats = updated;
                    }
                }
            })
            return state
        },
        addCurrentChatMessages: (state, action: PayloadAction<{ data: IMessages, chat?: IUser }>) => {
            const message = action.payload.data;
            const chat = state.chats.find(c => Number(c.id) === Number(message.sender_user_id) || Number(c.id) === Number(message.user_id));
            if (chat) {
                const messages = [...chat.messages, message];
                const updated = state.chats.map(ch => {
                    if (Number(ch.id) === Number(message.sender_user_id) || Number(ch.id) === Number(message.user_id)) {
                        return {
                            ...ch,
                            messages
                        }
                    } else {
                        return ch
                    }
                });
                state.chats = updated;
            } else {
                if (action.payload.chat) {
                    const chats = [...state.chats, { ...action.payload.chat, messages: [message] }];
                    state.chats = chats
                }
            }
            return state
        },
        updateCurrentChatMessages: (state, action: PayloadAction<IMessages>) => {
            const message = action.payload;
            const chat = state.chats.find(c => Number(c.id) === Number(message.sender_user_id) || Number(c.id) === Number(message.user_id));
            if (chat) {
                const messages = chat.messages.map(m => {
                    if (Number(m.id) === Number(message.id)) {
                        return message as IMessages
                    } else {
                        return m
                    }
                });
                const updated = state.chats.map(ch => {
                    if (Number(ch.id) === Number(message.sender_user_id) || Number(ch.id) === Number(message.user_id)) {
                        return {
                            ...ch,
                            messages
                        }
                    } else {
                        return ch
                    }
                });
                state.chats = updated;
            }
            return state
        },
        updateChats: (state, action: PayloadAction<readedMessage[]>) => {
            const messages = action.payload;
            const updatedChats = state.chats.map(ch => {
                return {
                    ...ch,
                    messages: ch.messages.map(m => {
                        const find = messages.find(i => Number(i.id) === Number(m.id));
                        if (find) {
                            return { ...m, read: true };
                        } else {
                            return m;
                        }
                    }),
                };
            });
            state.chats = updatedChats;
            return state
        },
    }
});

export const { updateUserStatus, updateChats, deleteCurrentChatMessages, loginAction, logOutAction, setUsers, addUser, setChats, addCurrentChatMessages, updateCurrentChatMessages } = userSlice.actions;
export default userSlice.reducer;
