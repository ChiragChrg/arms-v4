import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                subjects: true,
                creator: true,
            },
        });

        if (!courses) {
            return NextResponse.json({ error: "No courses found" }, { status: 404 });
        }

        return NextResponse.json(courses, { status: 200 });
    } catch (err) {
        console.error("Error fetching courses:", err);
        return NextResponse.json({ error: "Uncaught Course Error" }, { status: 500 });
    }
}