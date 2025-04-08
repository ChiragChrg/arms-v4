import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

type Params = {
    params: {
        userId: string;
    }
};

export async function GET({ params }: Params) {
    const { userId } = params;

    try {
        const faculty = await prisma.user.findUnique({
            where: {
                id: userId,
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

        if (!faculty) {
            return NextResponse.json({ message: "Faculty not found" }, { status: 404 });
        }

        return NextResponse.json(faculty, { status: 200 });
    } catch (err) {
        console.error("Get Faculty By ID Error : \n" + err);
        return NextResponse.json(JSON.stringify(err), { status: 500 });
    }
}