import { IUser } from "../types/user";

export type RootStackParams = {
    login: undefined;
    home: undefined;
    splash:undefined;
    contact: undefined;
    updateProfile: undefined,
    privateMessages: {
      user: IUser;
      message_id_for_view?: string;
    };
    root: undefined
  };