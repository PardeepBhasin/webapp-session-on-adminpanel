import { create } from 'zustand'

export type UserObj = {
    username: string;
    email: string;
    phoneNumber: string;
    role: {
        name: string;
    } | null;
}
type AppState = {
    userDetails: UserObj[]
}
type AppAction = {
    setUserDetails: (userObj: UserObj[] | any) => void
}
const userStore = create<AppState & AppAction>((set) => ({
    userDetails: [],
    setUserDetails: (userDetails: UserObj[] | UserObj) => set((state) => {
        return {
            userDetails: userDetails instanceof Array ? userDetails : [...state.userDetails, userDetails]
        }
    }),
}))

export default userStore;