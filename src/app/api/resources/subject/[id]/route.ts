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
            include: {
                units: true,
                creator: true,
            },
        });

        if (!subject) {
            return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
        }

        return NextResponse.json(subject, { status: 200 });
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