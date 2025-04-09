import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
    try {
        const institutions = await prisma.institute.findMany({
            include: {
                courses: true,
                creator: true,
            },
        });

        if (!institutions) {
            return NextResponse.json({ error: "No institutions found" }, { status: 404 });
        }

        return NextResponse.json(institutions, { status: 200 });
    } catch (err) {
        console.error("Error fetching institutions:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}