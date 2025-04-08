import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
    try {
        const pendingApproval = await prisma.user.findMany({
            where: {
                isApproved: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        });

        if (!pendingApproval) {
            return NextResponse.json({ message: "No pending approval faculty found" }, { status: 404 });
        }

        return NextResponse.json(pendingApproval, { status: 200 });
    } catch (err) {
        console.error("Get Pending Approval Faculty Error : \n" + err);
        return NextResponse.json(JSON.stringify(err), { status: 500 });
    }
}