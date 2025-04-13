import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get a institution by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const institution = await prisma.institute.findUnique({
            where: { id },
            include: {
                courses: true,
                creator: true,
            },
        });

        if (!institution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        return NextResponse.json(institution, { status: 200 });
    } catch (err) {
        console.error("Error fetching institution:", err);
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
    }
}

// Delete an institution
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Check if the institution exists
        const existingInstitution = await prisma.institute.findUnique({
            where: { id },
        });

        if (!existingInstitution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        // Delete the institution
        await prisma.institute.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Institution deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Error deleting institution:", err);
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
    }
}