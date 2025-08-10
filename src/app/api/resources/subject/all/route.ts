import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import _ from 'lodash';

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            select: {
                id: true,
                subjectName: true,
                subjectDesc: true,
                createdAt: true,
                units: {
                    include: {
                        documents: true,
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                isApproved: true,
                            }
                        }
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

        // Fetch related content flatly
        const [units, documents] = await Promise.all([
            prisma.unit.findMany({ select: { id: true, subjectId: true } }),
            prisma.document.findMany({ select: { id: true, unitId: true } }),
        ]);

        // Build lookup maps for fast aggregation
        const unitsBySubject = _.groupBy(units, 'subjectId');
        const documentsByUnit = _.groupBy(documents, 'unitId');

        const result = subjects.map(subject => {
            const subjectUnits = unitsBySubject[subject.id] || [];

            let documentCount = 0;

            for (const unit of subjectUnits) {
                const unitDocuments = documentsByUnit[unit.id] || [];
                documentCount += unitDocuments.length;
            }

            return {
                ...subject,
                counts: {
                    units: subjectUnits.length,
                    documents: documentCount,
                },
            };
        });

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error('Error fetching subjects:', err);
        return NextResponse.json({ error: 'Uncaught Subject Error' }, { status: 500 });
    }
}