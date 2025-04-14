import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get Course by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const course = await prisma.course.findFirst({
            where: {
                courseName: {
                    contains: slug.replaceAll("-", " "),
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                courseName: true,
                courseDesc: true,
                createdAt: true,
                subjects: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        isApproved: true,
                    }
                },
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Fetch related content flatly
        const [subjects, units, documents] = await Promise.all([
            prisma.subject.findMany({ where: { courseId: course.id }, select: { id: true } }),
            prisma.unit.findMany({ select: { id: true, subjectId: true } }),
            prisma.document.findMany({ select: { id: true, unitId: true } }),
        ]);

        const subjectIds = subjects.map(s => s.id);
        const unitIds = units.filter(u => subjectIds.includes(u.subjectId)).map(u => u.id);
        const documentIds = documents.filter(d => unitIds.includes(d.unitId)).map(d => d.id);

        const counts = {
            subjects: subjectIds.length,
            units: unitIds.length,
            documents: documentIds.length,
        };

        return NextResponse.json({ ...course, counts }, { status: 200 });
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