import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { prisma } from "@/prisma"
import * as bcrypt from "bcrypt"

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        }),
        Github({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@email.com" },
                password: { label: "Password", type: "password", placeholder: "Enter Password" },
            },
            authorize: async (credentials) => {
                let user = null

                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null
                    }

                    const email = credentials?.email as string
                    const password = credentials?.password as string

                    const userExists = await prisma.user.findUnique({ where: { email } })
                    const matchPassword = await bcrypt.compare(password, userExists?.password as string)

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

                    console.log("\nCredentials:", user)
                    return user
                } catch (err) {
                    console.log("\nCredentialsErr: ", err)
                    return null
                }
            },

        }),
    ]
} satisfies NextAuthConfig