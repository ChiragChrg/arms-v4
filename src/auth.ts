import NextAuth from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config"
import { prisma } from "@/prisma"


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as unknown as import("next-auth/adapters").Adapter,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    secret: process.env.AUTH_SECRET,
    debug: true,
    ...authConfig,
})