// User types
export interface UserTypes {
    id: string;
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
    isApproved: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    accessToken: string;
}

export type UserState = {
    userData: UserTypes;
    isAdmin: boolean;
    isLoading: boolean;
}
