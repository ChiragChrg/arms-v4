import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
import { sign } from "jsonwebtoken";

interface RequestBody {
    email: string,
}

export async function POST(request: NextRequest) {
    const { email }: RequestBody = await request.json()

    try {
        if (!email) {
            throw new Error("Missing Fields")
        }

        const userExists = await prisma.user.findUnique({ where: { email } })
        if (!userExists) {
            return new NextResponse("User does not exist!", { status: 400 })
        }

        const key = sign(
            {
                id: userExists?.id,
                name: userExists?.name
            },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "10min",
            }
        )

        const encryptedLink = `${process.env.NEXTAUTH_URL}/auth/reset-password/${key}`

        const reset = {
            name: userExists?.name,
            email: userExists?.email,
            resetLink: encryptedLink
        }

        return new NextResponse(JSON.stringify({ reset, message: "Email sent Successfully!" }), { status: 200 })
    } catch (err) {
        console.log("Forgot Password Error : \n" + err);
        return new NextResponse(JSON.stringify(err), { status: 500 })
    }
}