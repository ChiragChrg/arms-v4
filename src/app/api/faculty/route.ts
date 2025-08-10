import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

type ApproveFacultyType = {
    facultyId: string;
    approval: "approve" | "reject";
};

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