import { atom } from "recoil";

export interface IUser {
    uid: string | null
}

export const isLogin = atom({
    key : "isLogin",
    default : false
})

export const user = atom<IUser>({
    key : "userObj",
    default : {
        uid : null
    }
})


export const profilecheck = atom({
    key : "profile",
    default : false
})

export const firstProfile = atom({
    key : "firstprofile",
    default : true
})
