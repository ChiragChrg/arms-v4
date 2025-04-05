// User types
export interface UserTypes {
    uid: string,
    username: string,
    email: string,
    avatarImg: string,
    isApproved: boolean,
    accessToken: string,
}

export type UserState = {
    userData: UserTypes;
    isAdmin: boolean;
    isLoading: boolean;
}
