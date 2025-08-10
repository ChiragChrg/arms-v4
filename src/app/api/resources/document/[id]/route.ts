import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get Document by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const document = await prisma.document.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        isApproved: true,
                    }
                },
            },
        });

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        return NextResponse.json(document, { status: 200 });
    } catch (err) {
        console.error("Error fetching document:", err);
        return NextResponse.json({ error: "Uncaught Document Error" }, { status: 500 });
    }
}

// Delete Document
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const deletedDocument = await prisma.document.delete({
            where: { id },
        });

        return NextResponse.json(deletedDocument, { status: 200 });
    } catch (err) {
        console.error("Error deleting document:", err);
        return NextResponse.json({ error: "Uncaught Document Error" }, { status: 500 });
    }
}