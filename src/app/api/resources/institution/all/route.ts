import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import _ from "lodash";

export async function GET() {
    try {
        const institutes = await prisma.institute.findMany({
            select: {
                id: true,
                instituteName: true,
                description: true,
                createdAt: true,
                courses: true,
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
        const [courses, subjects, units, documents] = await Promise.all([
            prisma.course.findMany({ select: { id: true, instituteId: true } }),
            prisma.subject.findMany({ select: { id: true, courseId: true } }),
            prisma.unit.findMany({ select: { id: true, subjectId: true } }),
            prisma.document.findMany({ select: { id: true, unitId: true } }),
        ]);

        // Build lookup maps for fast aggregation
        const coursesByInstitute = _.groupBy(courses, 'instituteId');
        const subjectsByCourse = _.groupBy(subjects, 'courseId');
        const unitsBySubject = _.groupBy(units, 'subjectId');
        const documentsByUnit = _.groupBy(documents, 'unitId');

        const result = institutes.map(institute => {
            const instCourses = coursesByInstitute[institute.id] || [];

            let subjectCount = 0;
            let unitCount = 0;
            let documentCount = 0;

            for (const course of instCourses) {
                const courseSubjects = subjectsByCourse[course.id] || [];
                subjectCount += courseSubjects.length;

                for (const subject of courseSubjects) {
                    const subjectUnits = unitsBySubject[subject.id] || [];
                    unitCount += subjectUnits.length;

                    for (const unit of subjectUnits) {
                        const unitDocuments = documentsByUnit[unit.id] || [];
                        documentCount += unitDocuments.length;
                    }
                }
            }

            return {
                ...institute,
                counts: {
                    courses: instCourses.length,
                    subjects: subjectCount,
                    units: unitCount,
                    documents: documentCount
                }
            };
        });

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error("Error fetching institutions (Mongo):", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
