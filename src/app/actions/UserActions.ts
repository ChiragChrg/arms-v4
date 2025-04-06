"use server"

import { prisma } from "@/prisma"
import * as bcrypt from "bcryptjs"

type RegisterUserType = {
    name: string,
    email: string,
    password: string
}

export async function registerUser({ name, email, password }: RegisterUserType) {
    if (!name || !email || !password) {
        throw new Error("Missing Fields")
    }

    try {
        const userExists = await prisma.user.findUnique({ where: { email } })
        if (userExists) {
            throw new Error("User already Exists!")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        return {
            status: 201,
            message: "User Created Successfully!"
        }
    } catch (err) {
        console.error("User Registration Error : \n" + err);
        return {
            status: 500,
            message: "User Registration Failed!"
        }
    }
}

export async function deleteUser(userId: string) {
    console.log("userID", userId)
    if (!userId) {
        throw new Error("Missing User ID")
    }

    try {
        const userExists = await prisma.user.findUnique({ where: { id: userId } })
        console.log("userExists", userExists)

        if (!userExists)
            throw new Error("User does not Exist!")
        else
            await prisma.user.delete({ where: { id: userId } })

        return {
            status: 201,
            message: "User Deleted Successfully!"
        }
    } catch (err) {
        console.error("User Deletion Error : \n" + err);
        return {
            status: 500,
            message: "User Deletion Failed!"
        }
    }
}