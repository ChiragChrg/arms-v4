import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                units: true,
                creator: true,
            },
        });

        return NextResponse.json(subjects, { status: 200 });
    } catch (err) {
        console.error('Error fetching subjects:', err);
        return NextResponse.json({ error: 'Uncaught Subject Error' }, { status: 500 });
    }
}