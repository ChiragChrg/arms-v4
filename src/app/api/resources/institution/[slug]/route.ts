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
                courses: {
                    include: {
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
                },
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

        if (!institution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        const courseIds = institution.courses.map(c => c.id);

        const subjects = await prisma.subject.findMany({
            where: { courseId: { in: courseIds } },
            select: { id: true, courseId: true },
        });

        const subjectIds = subjects.map(s => s.id);

        const units = await prisma.unit.findMany({
            where: { subjectId: { in: subjectIds } },
            select: { id: true, subjectId: true },
        });

        const unitIds = units.map(u => u.id);

        const documents = await prisma.document.findMany({
            where: { unitId: { in: unitIds } },
            select: { id: true, unitId: true },
        });

        // Aggregate counts per course
        const courseWithCounts = institution.courses.map(course => {
            const courseSubjects = subjects.filter(s => s.courseId === course.id);
            const courseSubjectIds = courseSubjects.map(s => s.id);
            const courseUnits = units.filter(u => courseSubjectIds.includes(u.subjectId));
            const courseUnitIds = courseUnits.map(u => u.id);
            const courseDocuments = documents.filter(d => courseUnitIds.includes(d.unitId));

            return {
                ...course,
                counts: {
                    subjects: courseSubjects.length,
                    units: courseUnits.length,
                    documents: courseDocuments.length,
                },
            };
        });

        const updatedInstitution = {
            ...institution,
            courses: courseWithCounts,
            counts: {
                courses: courseIds.length,
                subjects: subjects.length,
                units: units.length,
                documents: documents.length,
            },
        };

        return NextResponse.json(updatedInstitution, { status: 200 });

    } catch (err) {
        console.error("Error fetching institution by ID:", err);
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
    }
}

// Delete an institution
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        // Check if the institution exists
        const existingInstitution = await prisma.institute.findUnique({
            where: { id: slug },
        });

        if (!existingInstitution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        // Delete the institution
        await prisma.institute.delete({
            where: { id: slug },
        });

        return NextResponse.json({ message: "Institution deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting institution:", err);
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
    }
}