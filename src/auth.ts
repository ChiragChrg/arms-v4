import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config"
import { prisma } from "@/prisma"

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            emailVerified: boolean | null,
            isApproved: boolean,
            createdAt: Date | null,
            updatedAt: Date | null,
            accessToken: string,
        } & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    secret: process.env.AUTH_SECRET,
    debug: true,
    ...authConfig,
})