import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

type Params = {
    params: { id: string };
};

type CreateDocumentType = {
    documentName: string;
    documentDesc: string;
    type: string;
    size: string;
    link: string;
    unitId: string;
    creatorId: string;
};

type UpdateDocumentType = {
    id: string;
    documentName: string;
    documentDesc: string;
};

// Get Document by ID
export async function GET({ params }: Params) {
    const { id } = params;

    try {
        const document = await prisma.document.findUnique({
            where: { id },
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

// Create Document
export async function POST(request: NextRequest) {
    const { documentName, documentDesc, type, size, link, unitId, creatorId }: CreateDocumentType = await request.json();

    try {
        if (!documentName || !documentDesc || !type || !size || !link || !unitId || !creatorId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if the document already exists
        const existingDocument = await prisma.document.findFirst({
            where: { documentName },
        });

        if (existingDocument) {
            return NextResponse.json({ error: "Document name already exists" }, { status: 400 });
        }

        const newDocument = await prisma.document.create({
            data: {
                documentName,
                documentDesc,
                type,
                size,
                link,
                unitId,
                creatorId,
            },
        });

        return NextResponse.json(newDocument, { status: 201 });
    } catch (err) {
        console.error("Error creating document:", err);
        return NextResponse.json({ error: "Uncaught Document Error" }, { status: 500 });
    }
}

// Update Document
export async function PUT(request: NextRequest) {
    const { id, documentName, documentDesc }: UpdateDocumentType = await request.json();

    try {
        if (!id || !documentName || !documentDesc) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const updatedDocument = await prisma.document.update({
            where: { id },
            data: {
                documentName,
                documentDesc,
            },
        });

        return NextResponse.json(updatedDocument, { status: 200 });
    } catch (err) {
        console.error("Error updating document:", err);
        return NextResponse.json({ error: "Uncaught Document Error" }, { status: 500 });
    }
}

// Delete Document
export async function DELETE({ params }: Params) {
    const { id } = params;

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