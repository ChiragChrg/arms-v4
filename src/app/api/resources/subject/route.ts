import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

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