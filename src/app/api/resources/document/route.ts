import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

type UploadDocumentType = {
    documentName: string;
    documentDesc: string;
    type: string;
    size: string;
    link: string;
}

type CreateDocumentType = {
    documentData: UploadDocumentType[];
    unitId: string;
    creatorId: string;
};

type UpdateDocumentType = {
    id: string;
    documentName: string;
    documentDesc: string;
};

// Create Document
export async function POST(request: NextRequest) {
    const { documentData, unitId, creatorId }: CreateDocumentType = await request.json();

    try {
        if (documentData.length <= 0 || !unitId || !creatorId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create Multiple Documents
        const createdDocuments = await Promise.all(
            documentData.map((document) =>
                prisma.document.create({
                    data: {
                        documentName: document.documentName,
                        documentDesc: document.documentDesc,
                        type: document.type,
                        size: document.size,
                        link: document.link,
                        unitId,
                        creatorId,
                    },
                })
            )
        );

        return NextResponse.json(createdDocuments, { status: 201 });
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