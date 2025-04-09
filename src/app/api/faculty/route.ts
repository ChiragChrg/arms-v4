import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

type Params = {
    params: {
        userId: string;
    }
};

type ApproveFacultyType = {
    facultyId: string;
    approval: "approve" | "reject";
};

// GET Faculty By ID
export async function GET({ params }: Params) {
    const { userId } = params;

    try {
        const faculty = await prisma.user.findUnique({
            where: {
                id: userId,
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

// Approve or Reject Faculty
export async function POST(request: NextRequest) {
    const { facultyId, approval }: ApproveFacultyType = await request.json();

    try {
        await prisma.user.update({
            where: { id: facultyId },
            data: { isApproved: approval === "approve" },
        });

        return NextResponse.json(
            {
                message: `Faculty ${approval === "approve" ? "Approved" : "Rejected"}!`,
            },
            { status: 200 }
        );
    }
    catch (err) {
        console.error("Error in Faculty Approval: ", err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Delete Faculty
export async function DELETE(request: NextRequest) {
    const { facultyId } = await request.json();

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