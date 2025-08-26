import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Get Unit by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const unit = await prisma.unit.findFirst({
            where: {
                unitName: {
                    contains: slug.replaceAll("-", " "),
                    mode: 'insensitive'
                }
            },
            include: {
                documents: {
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
                    }
                },
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

        if (!unit) {
            return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
        }

        return NextResponse.json(unit, { status: 200 });
    } catch (err) {
        console.error('Error fetching unit:', err);
        return NextResponse.json({ error: 'Uncaught Unit Error' }, { status: 500 });
    }
}

// Delete Unit
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const deletedUnit = await prisma.unit.delete({
            where: { id: slug }
        });

        return NextResponse.json(deletedUnit, { status: 200 });
    } catch (err) {
        console.error('Error deleting unit:', err);
        return NextResponse.json({ error: 'Uncaught Unit Error' }, { status: 500 });
    }
}