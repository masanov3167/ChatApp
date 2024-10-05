export type IUser = {
    id: number,
    name: string,
    phone: string,
    login: string,
    last_upd: Date,
    isonline: boolean
}

export type IUserWithToken = {
    id:number,
    name:string,
    phone:string,
    parol:string,
    login: string
    token: string
}


export type IEditUser = {
    name:string,
    phone:string,
    parol:string,
    login: string
}