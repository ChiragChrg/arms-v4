import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get a institution by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const institution = await prisma.institute.findFirst({
            where: {
                instituteName: {
                    contains: slug.replaceAll("-", " "),
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                instituteName: true,
                description: true,
                createdAt: true,
                creator: true,
                courses: true
            }
        });

        if (!institution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        // Fetch related content flatly
        const [courses, subjects, units, documents] = await Promise.all([
            prisma.course.findMany({ where: { instituteId: institution.id }, select: { id: true } }),
            prisma.subject.findMany({ select: { id: true, courseId: true } }),
            prisma.unit.findMany({ select: { id: true, subjectId: true } }),
            prisma.document.findMany({ select: { id: true, unitId: true } }),
        ]);

        const courseIds = courses.map(c => c.id);
        const subjectIds = subjects.filter(s => courseIds.includes(s.courseId)).map(s => s.id);
        const unitIds = units.filter(u => subjectIds.includes(u.subjectId)).map(u => u.id);
        const documentIds = documents.filter(d => unitIds.includes(d.unitId)).map(d => d.id);

        const counts = {
            courses: courseIds.length,
            subjects: subjectIds.length,
            units: unitIds.length,
            documents: documentIds.length,
        };

        return NextResponse.json({ ...institution, counts }, { status: 200 });

    } catch (err) {
        console.error("Error fetching institution by ID:", err);
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
    }
}

// Delete an institution
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Check if the institution exists
        const existingInstitution = await prisma.institute.findUnique({
            where: { id },
        });

        if (!existingInstitution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        // Delete the institution
        await prisma.institute.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Institution deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting institution:", err);
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
    }
}