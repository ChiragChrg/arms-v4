import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

type Params = {
    params: { id: string };
};

type CreateCourseType = {
    courseName: string,
    courseDesc: string,
    instituteId: string,
    creatorId: string
}

type UpdateCourseType = {
    id: string;
    courseName: string;
    courseDesc: string;
}

// Get Course by ID
export async function GET({ params }: Params) {
    const { id } = params;

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

// Create Course
export async function POST(request: NextRequest) {
    const { courseName, courseDesc, instituteId, creatorId }: CreateCourseType = await request.json();

    try {
        if (!courseName || !courseDesc || !instituteId || !creatorId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Check if the course already exists
        const existingCourse = await prisma.course.findFirst({
            where: { courseName },
        });

        if (existingCourse) {
            return NextResponse.json({ error: 'Course name already exists' }, { status: 400 });
        }

        const newCourse = await prisma.course.create({
            data: {
                courseName,
                courseDesc,
                instituteId,
                creatorId,
            },
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (err) {
        console.error('Error creating course:', err);
        return NextResponse.json({ error: 'Uncaught Course Error' }, { status: 500 });
    }
}

// Update Course
export async function PUT(request: NextRequest) {
    const { id, courseName, courseDesc }: UpdateCourseType = await request.json();

    try {
        if (!id || !courseName || !courseDesc) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updatedCourse = await prisma.course.update({
            where: { id },
            data: {
                courseName,
                courseDesc,
            },
        });

        return NextResponse.json(updatedCourse, { status: 200 });
    } catch (err) {
        console.error('Error updating course:', err);
        return NextResponse.json({ error: 'Uncaught Course Error' }, { status: 500 });
    }
}

// Delete Course
export async function DELETE(params: Params) {
    const { id } = params.params;

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