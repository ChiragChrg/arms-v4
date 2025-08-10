import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import _ from "lodash";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                courseName: true,
                courseDesc: true,
                createdAt: true,
                subjects: true,
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
        });

        // Fetch all related content flatly
        const [subjects, units, documents] = await Promise.all([
            prisma.subject.findMany({ select: { id: true, courseId: true } }),
            prisma.unit.findMany({ select: { id: true, subjectId: true } }),
            prisma.document.findMany({ select: { id: true, unitId: true } }),
        ]);

        // Build lookup maps for fast aggregation
        const subjectsByCourse = _.groupBy(subjects, 'courseId');
        const unitsBySubject = _.groupBy(units, 'subjectId');
        const documentsByUnit = _.groupBy(documents, 'unitId');

        const result = courses.map(course => {
            const courseSubjects = subjectsByCourse[course.id] || [];

            let unitCount = 0;
            let documentCount = 0;

            for (const subject of courseSubjects) {
                const subjectUnits = unitsBySubject[subject.id] || [];
                unitCount += subjectUnits.length;

                for (const unit of subjectUnits) {
                    const unitDocuments = documentsByUnit[unit.id] || [];
                    documentCount += unitDocuments.length;
                }
            }

            return {
                ...course,
                counts: {
                    subjects: courseSubjects.length,
                    units: unitCount,
                    documents: documentCount
                }
            };
        });

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error("Error fetching courses:", err);
        return NextResponse.json({ error: "Uncaught Course Error" }, { status: 500 });
    }
}