export type IApiReturn<T> = {
    ok:boolean,
    data: T | null,
    msg: string
}