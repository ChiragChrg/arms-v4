import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
    try {
        const faculty = await prisma.user.findMany({
            where: {
                id: {
                    not: process.env.NEXT_PUBLIC_ARMS_ADMIN_UID,
                },
                isApproved: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                isApproved: true,
                createdAt: true,
            },
        });
        return NextResponse.json(faculty, { status: 200 });
    } catch (err) {
        console.error("Get All Faculty Error : \n" + err);
        return NextResponse.json(JSON.stringify(err), { status: 500 });
    }
}