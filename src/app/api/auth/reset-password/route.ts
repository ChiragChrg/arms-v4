import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
import * as bcrypt from "bcryptjs"

interface RequestBody {
    id: string,
    password: string,
}

export async function POST(request: NextRequest) {
    const { id, password }: RequestBody = await request.json()

    try {
        if (!id || !password) {
            throw new Error("Missing Fields")
        }

        const userExists = await prisma.user.findUnique({ where: { id } })
        if (!userExists) {
            return new NextResponse("User does not exist!", { status: 400 })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword
            }
        })

        return new NextResponse(JSON.stringify({ message: "Password reset successful!" }), { status: 201 })
    } catch (err) {
        console.error("Reset Password Error : \n" + err)
        return new NextResponse(JSON.stringify(err), { status: 500 })
    }
}