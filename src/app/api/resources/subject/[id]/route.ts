import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get Subject by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const subject = await prisma.subject.findUnique({
            where: { id },
            select: {
                id: true,
                subjectName: true,
                subjectDesc: true,
                createdAt: true,
                creator: true,
                units: true
            },
        });

        if (!subject) {
            return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
        }

        // Fetch related content flatly
        const [units, documents] = await Promise.all([
            prisma.unit.findMany({ where: { subjectId: id }, select: { id: true } }),
            prisma.document.findMany({ select: { id: true, unitId: true } }),
        ]);

        const unitIds = units.map(u => u.id);
        const documentIds = documents.map(d => d.id);

        const counts = {
            units: unitIds.length,
            documents: documentIds.length,
        };

        return NextResponse.json({ ...subject, counts }, { status: 200 });
    } catch (err) {
        console.error('Error fetching subject:', err);
        return NextResponse.json({ error: 'Uncaught Subject Error' }, { status: 500 });
    }
}

// Delete Subject
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const deletedSubject = await prisma.subject.delete({
            where: { id },
        });

        return NextResponse.json(deletedSubject, { status: 200 });
    } catch (err) {
        console.error('Error deleting subject:', err);
        return NextResponse.json({ error: 'Uncaught Subject Error' }, { status: 500 });
    }
}