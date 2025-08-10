import { NextRequest, NextResponse, } from "next/server";
import { prisma } from "@/prisma";

// GET Faculty By ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ facultyId: string }> }
) {
    const { facultyId } = await params;

    try {
        const faculty = await prisma.user.findUnique({
            where: {
                id: facultyId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                isApproved: true,
                createdAt: true,
            },
        });

        if (!faculty) {
            return NextResponse.json({ message: "Faculty not found" }, { status: 404 });
        }

        return NextResponse.json(faculty, { status: 200 });
    } catch (err) {
        console.error("Get Faculty By ID Error : \n" + err);
        return NextResponse.json(JSON.stringify(err), { status: 500 });
    }
}

// Delete Faculty
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ facultyId: string }> }
) {
    const { facultyId } = await params;

    try {
        await prisma.user.delete({
            where: { id: facultyId },
        });

        return NextResponse.json({ message: "Faculty Deleted!" }, { status: 200 });
    } catch (err) {
        console.error("Error in Faculty Deletion: ", err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}