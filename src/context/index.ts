import React from 'react';
import io, { Socket } from "socket.io-client"; 
import { variables } from '../utils/variables';
import { userStorage } from '../mmkv/storage';

export const socket = io(variables.socketUrl, { 
    transports: ['websocket'], 
    auth:{token: userStorage.getString("token")},
});
export const SocketContext = React.createContext<Socket>(socket);