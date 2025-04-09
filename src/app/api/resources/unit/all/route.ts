import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
    try {
        const units = await prisma.unit.findMany({});

        return NextResponse.json(units, { status: 200 });
    } catch (err) {
        console.error("Error fetching units:", err);
        return NextResponse.json({ error: "Uncaught Unit Error" }, { status: 500 });
    }
}
