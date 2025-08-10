import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
import * as bcrypt from "bcryptjs"

type RegisterUserType = {
    name: string,
    email: string,
    password: string,
}

export async function POST(request: NextRequest) {
    const { name, email, password }: RegisterUserType = await request.json()

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

        return new NextResponse("User Created Successfully!", { status: 201 })
    } catch (err) {
        console.error("User Registration Error : \n" + err);
        return new NextResponse(JSON.stringify(err), { status: 500 })
    }
}