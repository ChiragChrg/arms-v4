import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";


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
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
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
        return NextResponse.json({ error: "Uncaught Institution Error" }, { status: 500 });
    }
}