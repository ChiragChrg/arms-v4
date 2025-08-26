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
                subjects: {
                    include: {
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                isApproved: true,
                            }
                        }
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

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const subjectIds = course.subjects.map(s => s.id);
        const units = await prisma.unit.findMany({
            where: { subjectId: { in: subjectIds } },
            select: { id: true, subjectId: true },
        });
        const unitIds = units.map(u => u.id);
        const documents = await prisma.document.findMany({
            where: { unitId: { in: unitIds } },
            select: { id: true, unitId: true },
        });

        const subjectWithCounts = course.subjects.map(subject => {
            const subjectUnits = units.filter(unit => unit.subjectId === subject.id);
            const subjectDocuments = documents.filter(document => subjectUnits.some(unit => unit.id === document.unitId));

            return {
                ...subject,
                counts: {
                    units: subjectUnits.length,
                    documents: subjectDocuments.length,
                }
            };
        });

        const updatedCourse = {
            ...course,
            subjects: subjectWithCounts,
            counts: {
                subjects: course.subjects.length,
                units: units.length,
                documents: documents.length,
            },
        };

        return NextResponse.json(updatedCourse, { status: 200 });
    } catch (err) {
        console.error('Error fetching course:', err);
        return NextResponse.json({ error: 'Uncaught Course Error' }, { status: 500 });
    }
}

// Delete Course
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        if (!slug) {
            return NextResponse.json({ error: 'Missing course ID' }, { status: 400 });
        }

        const deletedCourse = await prisma.course.delete({
            where: { id: slug },
        });

        return NextResponse.json(deletedCourse, { status: 200 });
    } catch (err) {
        console.error('Error deleting course:', err);
        return NextResponse.json({ error: 'Uncaught Course Error' }, { status: 500 });
    }
}