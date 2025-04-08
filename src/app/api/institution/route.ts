import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

type Params = {
    params: { id: string };
};

type CreateInstituteRequest = {
    instituteName: string,
    instituteDesc: string,
    creatorId: string
}

type UpdateInstituteRequest = {
    id: string,
    instituteName: string,
    instituteDesc: string,
}


// Get a single institution by ID
export async function GET({ params }: Params) {
    const { id } = params;

    try {
        const institution = await prisma.institute.findUnique({
            where: { id },
            include: {
                courses: true,
            },
        });

        if (!institution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        return NextResponse.json(institution, { status: 200 });
    } catch (err) {
        console.error("Error fetching institution:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Create a new institution
export async function POST(request: NextRequest) {
    const { instituteName, instituteDesc, creatorId }: CreateInstituteRequest = await request.json();

    try {
        if (!instituteName || !instituteDesc || !creatorId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if the institution already exists
        const existingInstitution = await prisma.institute.findUnique({
            where: { instituteName },
        });

        if (existingInstitution) {
            return NextResponse.json({ error: "Institution name already exists" }, { status: 400 });
        }

        // Create the new institution
        const newInstitution = await prisma.institute.create({
            data: {
                instituteName: instituteName,
                description: instituteDesc,
                creatorId,
            },
        });

        if (!newInstitution) {
            return NextResponse.json({ error: "Failed to create institution" }, { status: 500 });
        }

        return NextResponse.json(newInstitution, { status: 201 });
    } catch (err) {
        console.error("Error creating institution:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Update an institution
export async function PUT(request: NextRequest) {
    const { id, instituteName, instituteDesc }: UpdateInstituteRequest = await request.json();

    try {
        if (!id || !instituteName || !instituteDesc) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if the institution exists
        const existingInstitution = await prisma.institute.findUnique({
            where: { id },
        });

        if (!existingInstitution) {
            return NextResponse.json({ error: "Institution not found" }, { status: 404 });
        }

        // Update the institution
        const updatedInstitution = await prisma.institute.update({
            where: { id },
            data: {
                instituteName,
                description: instituteDesc,
            },
        });

        if (!updatedInstitution) {
            return NextResponse.json({ error: "Failed to update institution" }, { status: 500 });
        }

        return NextResponse.json(updatedInstitution, { status: 200 });
    } catch (err) {
        console.error("Error updating institution:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Delete an institution
export async function DELETE({ params }: Params) {
    const { id } = params;

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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}