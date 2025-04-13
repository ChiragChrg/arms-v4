import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get Unit by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const unit = await prisma.unit.findUnique({
            where: { id },
            include: {
                documents: true,
                creator: true,
            },
        });

        if (!unit) {
            return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
        }

        return NextResponse.json(unit, { status: 200 });
    } catch (err) {
        console.error('Error fetching unit:', err);
        return NextResponse.json({ error: 'Uncaught Unit Error' }, { status: 500 });
    }
}

// Delete Unit
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const deletedUnit = await prisma.unit.delete({
            where: { id }
        });

        return NextResponse.json(deletedUnit, { status: 200 });
    } catch (err) {
        console.error('Error deleting unit:', err);
        return NextResponse.json({ error: 'Uncaught Unit Error' }, { status: 500 });
    }
}