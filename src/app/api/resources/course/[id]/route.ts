import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get Course by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const course = await prisma.course.findUnique({
            where: { id }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(course, { status: 200 });
    } catch (err) {
        console.error('Error fetching course:', err);
        return NextResponse.json({ error: 'Uncaught Course Error' }, { status: 500 });
    }
}

// Delete Course
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        if (!id) {
            return NextResponse.json({ error: 'Missing course ID' }, { status: 400 });
        }

        const deletedCourse = await prisma.course.delete({
            where: { id },
        });

        return NextResponse.json(deletedCourse, { status: 200 });
    } catch (err) {
        console.error('Error deleting course:', err);
        return NextResponse.json({ error: 'Uncaught Course Error' }, { status: 500 });
    }
}