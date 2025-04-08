import { NextResponse } from "next/server"
import { prisma } from "@/prisma"

export async function GET() {
    try {
        const res = await prisma.$transaction([
            prisma.institute.count(),
            prisma.course.count(),
            prisma.subject.count(),
            prisma.unitDoc.count()
        ]);

        const counts = {
            institute: res[0],
            course: res[1],
            subject: res[2],
            unitDoc: res[3],
        }

        return NextResponse.json(counts, { status: 200 })
    } catch (err) {
        console.error("DashCount Error : \n" + err);
        return NextResponse.json(JSON.stringify(err), { status: 500 })
    }
}