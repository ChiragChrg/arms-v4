/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from 'next-auth'

declare module "next-auth" {
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {
        id: string
        name: string
        email: string
        image: string
        emailVerified: boolean | null
        isApproved: boolean
        updatedAt: Date | null
        createdAt: Date | null
    }

    /**
     * Returned by `useSession`, `auth`, contains information about the active session.
     */
    interface Session {
        user: {
            id: string
            name: string
            email: string
            image: string
            emailVerified: boolean | null
            isApproved: boolean
            updatedAt: Date | null
            createdAt: Date | null
        } & DefaultSession["user"]
    }
}