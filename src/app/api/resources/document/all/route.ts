import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
    try {
        const documents = await prisma.document.findMany({
            include: {
                creator: true,
            },
        });

        return NextResponse.json(documents, { status: 200 });
    } catch (err) {
        console.error("Error fetching documents:", err);
        return NextResponse.json({ error: "Uncaught Document Error" }, { status: 500 });
    }
}