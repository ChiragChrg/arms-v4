import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { prisma } from "@/prisma"
import * as bcrypt from "bcryptjs"

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true
        }),
        Github({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            allowDangerousEmailAccountLinking: true
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@email.com" },
                password: { label: "Password", type: "password", placeholder: "Enter Password" },
            },
            authorize: async (credentials) => {
                let user = null

                try {
                    const { email, password } = credentials as { email: string; password: string }

                    // Check if credentials are provided
                    if (!email || !password) {
                        return null
                    }

                    // Fetch user from database
                    const userExists = await prisma.user.findUnique({ where: { email } })
                    const matchPassword = await bcrypt.compare(password, userExists?.password as string)

                    // Check if user exists and password matches
                    if (!userExists?.email || !matchPassword) throw new Error("Invalid Email or Password")

                    user = {
                        id: userExists.id,
                        name: userExists.name,
                        email: userExists.email,
                        image: userExists.image,
                        emailVerified: userExists.emailVerified ? true : null,
                        isApproved: userExists.isApproved,
                        updatedAt: userExists.updatedAt,
                        createdAt: userExists.createdAt,
                    }

                    // console.log("\nCredentials:", user)
                    return user
                } catch (err) {
                    console.error("\nCredentialsErr: ", err)
                    return null
                }
            },

        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                token.isApproved = user.isApproved
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub as string
                session.user.isApproved = token.isApproved as boolean
            }
            return session
        },
    },

} satisfies NextAuthConfig