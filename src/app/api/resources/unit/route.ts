import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

type CreateUnitType = {
    unitName: string,
    unitDesc: string,
    subjectId: string,
    creatorId: string
}

type UpdateUnitType = {
    id: string;
    unitName: string;
    unitDesc: string;
}

// Create Unit
export async function POST(request: NextRequest) {
    const { unitName, unitDesc, subjectId, creatorId }: CreateUnitType = await request.json();

    try {
        if (!unitName || !unitDesc || !subjectId || !creatorId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Check if the unit already exists
        const existingUnit = await prisma.unit.findFirst({
            where: { unitName },
        });

        if (existingUnit) {
            return NextResponse.json({ error: 'Unit name already exists' }, { status: 400 });
        }

        const newUnit = await prisma.unit.create({
            data: {
                unitName,
                unitDesc,
                subjectId,
                creatorId
            }
        });

        return NextResponse.json(newUnit, { status: 201 });
    } catch (err) {
        console.error('Error creating unit:', err);
        return NextResponse.json({ error: 'Uncaught Unit Error' }, { status: 500 });
    }
}

// Update Unit
export async function PUT(request: NextRequest) {
    const { id, unitName, unitDesc }: UpdateUnitType = await request.json();

    try {
        if (!unitName || !unitDesc) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updatedUnit = await prisma.unit.update({
            where: { id },
            data: {
                unitName,
                unitDesc
            }
        });

        return NextResponse.json(updatedUnit, { status: 200 });
    } catch (err) {
        console.error('Error updating unit:', err);
        return NextResponse.json({ error: 'Uncaught Unit Error' }, { status: 500 });
    }
}