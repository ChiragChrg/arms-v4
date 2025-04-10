import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

type Params = {
    params: { id: string };
};

type CreateSubjectType = {
    subjectName: string,
    subjectDesc: string,
    courseId: string,
    creatorId: string
}

type UpdateSubjectType = {
    id: string;
    subjectName: string;
    subjectDesc: string;
}

// Get Subject by ID
export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const subject = await prisma.subject.findUnique({
            where: { id }
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

// Create Subject
export async function POST(request: NextRequest) {
    const { subjectName, subjectDesc, courseId, creatorId }: CreateSubjectType = await request.json();

    try {
        if (!subjectName || !subjectDesc || !courseId || !creatorId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Check if the subject already exists
        const existingSubject = await prisma.subject.findFirst({
            where: { subjectName },
        });

        if (existingSubject) {
            return NextResponse.json({ error: 'Subject name already exists' }, { status: 400 });
        }

        const newSubject = await prisma.subject.create({
            data: {
                subjectName,
                subjectDesc,
                courseId,
                creatorId,
            },
        });

        return NextResponse.json(newSubject, { status: 201 });
    } catch (err) {
        console.error('Error creating subject:', err);
        return NextResponse.json({ error: 'Uncaught Subject Error' }, { status: 500 });
    }
}

// Update Subject
export async function PUT(request: NextRequest) {
    const { id, subjectName, subjectDesc }: UpdateSubjectType = await request.json();

    try {
        if (!id || !subjectName || !subjectDesc) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updatedSubject = await prisma.subject.update({
            where: { id },
            data: {
                subjectName,
                subjectDesc,
            },
        });

        return NextResponse.json(updatedSubject, { status: 200 });
    } catch (err) {
        console.error('Error updating subject:', err);
        return NextResponse.json({ error: 'Uncaught Subject Error' }, { status: 500 });
    }
}

// Delete Subject
export async function DELETE(_request: NextRequest, { params }: Params) {
    const { id } = params;

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