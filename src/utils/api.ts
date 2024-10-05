import { variables } from "./variables";
import { RootStackParams } from "../navigator/rootStackParams";
import { navigateReset } from "./functions";
import { useQuery } from "react-query";
import { IApiReturn } from "../types/api";
import { userStorage } from "../mmkv/storage";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { socket } from "../context";
  
    
  export const poster = async <T,K>(
    url: string,
    body: { data: K, json: boolean },
    nav?: DrawerNavigationProp<RootStackParams, any>,
  ):Promise<IApiReturn<T>> => {
    const result: IApiReturn<T> = { ok: false, data: null, msg: 'error' };
  
    try {
      const headers: Record<string, string> = {
        'Content-Type': body.json ? 'application/json' : 'multipart/form-data',
      };
      if(nav){
        const token = userStorage.getString("token");
        if (!token) {
          navigateReset(nav, "login");
          return result
        }
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(`${variables.baseUrl}/${url}`, {
        method:"POST",
        body: body.json ? JSON.stringify(body.data) : body.data as BodyInit_,
        headers,
      });
  
      if (response.status === 401) {
        userStorage.delete("token");
        if(nav){
          navigateReset(nav, "login");
        }
        return result
      }
      const data = await response.json()
      
      if (response.status === 201 || response.status === 200) {
        result.ok = true;
        result.data = data.data as T; 
        result.msg = data?.message || "ok";
      } else {
        result.msg = data?.message || 'Request failed';
      }
  
      return result;
    } catch (error) {
      result.msg = String(error);
      return result;
    }
  };
  
  export const getter = async <T>(url: string, nav: DrawerNavigationProp<RootStackParams, any>): Promise<IApiReturn<T>> => {
    const result: IApiReturn<T> = { ok: false, data: null, msg: '' };
  
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
  
      const token = userStorage.getString("token")
      if (!token) {
        navigateReset(nav, "login");
        return result
      }
      headers['Authorization'] = `Bearer ${token}`;
  
      const response = await fetch(`${variables.baseUrl}/${url}`, {
        method:"GET",
        headers,
      })
      
      if(response.status === 401){
        userStorage.delete("token");
        navigateReset(nav, "login");
        return result
      }
  
      const data = await response.json();
      if (response.status === 200) {
        result.ok = true;
        result.data = data.data as T; 
        result.msg = data?.message || 'ok';
      } else {
        result.msg = data?.message || 'Request failed';
      }
      return result
    } catch (error) {
      result.msg = String(error)
      return result;
    }
  };
  
  export const deleter = async <T>(url: string, nav: DrawerNavigationProp<RootStackParams, any>):Promise<IApiReturn<T>> => {
    const result:IApiReturn<T>  = { ok: false, data: null, msg: 'error' };
  
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
  
      const token =  userStorage.getString("token");
      if (!token) {
        navigateReset(nav, "login");
        return result
      }
      headers['Authorization'] = `Bearer ${token}`;
  
      const response = await fetch(`${variables.baseUrl}/${url}`, {
        method:"DELETE",
        headers,
      });
  
      if (response.status === 401) {
        userStorage.delete("token");
        navigateReset(nav, "login");
        return result
      }
      const data = await response.json();
      if (response.status === 200) {
        result.ok = true;
        result.data = data.data as T;
        result.msg = data?.message || "ok";
      } else {
        result.msg = data?.message || 'Request failed';
      }
      return result;
    } catch (error) {
      result.msg = String(error)
      return result;
    }
  };
  
  export const putter = async <T,K>(
    url: string,
    body: { data: K, json: boolean },
    nav: DrawerNavigationProp<RootStackParams, any>
  ):Promise<IApiReturn<T>> => {
    const result: IApiReturn<T> = { ok: false, data: null, msg: 'error' };
  
    try {
      const headers: Record<string, string> = {
        'Content-Type': body.json ? 'application/json' : 'multipart/form-data',
      };
  
      const token =  userStorage.getString("token");
      if (!token) {
        navigateReset(nav, "login");
        return result
      }
  
      headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`${variables.baseUrl}/${url}`,  {
        method:"PUT",
        body: body.json ? JSON.stringify(body.data) : body.data as BodyInit_,
        headers,
      });

      if (response.status === 401) {
        userStorage.delete("token");
        navigateReset(nav, "login");
        return result
      }
  
      const data = await response.json();
      if (response.status === 201 || response.status === 200) {
        result.ok = true;
        result.data = data?.data as T;
        result.msg = data?.message ||  'ok';
      } else {
        result.msg = data?.message || 'Request failed';
      }
  
      return result;
    } catch (error) {
      result.msg = String(error)
      return result;
    }
  };
  
  export const useGet = <T>(
    url: string,
    nav: DrawerNavigationProp<RootStackParams, any>,
    enabled?: boolean
  ): {
    error: Error | null;
    data: T | undefined;
    isLoading: boolean;
  } => {
  
    const { isLoading, error, data } = useQuery<T, Error>(
      url,
      async () => {
        const result = await getter(url, nav);
        if (result.ok && result.data) {
          return result.data as T; 
        } else {
          throw new Error(result.msg ?? 'Failed to fetch data');
        }
      },
      {
        enabled,
        refetchOnWindowFocus: false,
      }
    );
  
    return { error, data, isLoading }; 
  };

  export const socketEmit = <T,K>(emitName: string, data: K): Promise<IApiReturn<T>> => {
    return new Promise((resolve) => {
      socket.emit(emitName, data, (response: IApiReturn<T>) => {
        resolve(response)
      });
    });
  };
  