import { atom } from "recoil";

export interface IUser {
    uid: string | null
}

export const isLogin = atom({
    key : "isLogin",
    default : true
})

export const user = atom<IUser>({
    key : "userObj",
    default : {
        uid : null
    }
})

