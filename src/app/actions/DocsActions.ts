"use server"

import { prisma } from "@/prisma";

export async function getDashCount() {
    try {
        const res = await prisma.$transaction([
            prisma.institute.count(),
            prisma.course.count(),
            prisma.subject.count(),
            prisma.unitDoc.count()
        ]);

        const counts = {
            institute: res[0],
            course: res[1],
            subject: res[2],
            unitDoc: res[3],
        }

        return counts
    } catch (err) {
        console.error("Error : ", err || 'Failed to fetch DashCount');
    }
}

export async function getAllInstitutions() {
    try {
        const DocsDB = await prisma.institute.findMany()
        console.log("DocsDB", DocsDB)

        const data = JSON.parse(JSON.stringify(DocsDB)) //Converting to plain object

        return data
    } catch (err) {
        console.error(err);
        return err
    }
}

export async function getInstitution(instituteName: string) {
    try {
        const institute = await prisma.institute.findFirst({
            where: {
                instituteName: {
                    contains: instituteName,
                    mode: 'insensitive',
                },
            },
            // include: {
            //     creator: {
            //         select: {
            //             username: true,
            //             email: true,
            //             avatarImg: true,
            //         },
            //     },
            //     courses: {
            //         include: {
            //             creator: {
            //                 select: {
            //                     username: true,
            //                     email: true,
            //                     avatarImg: true,
            //                 },
            //             },
            //             subjects: {
            //                 include: {
            //                     creator: {
            //                         select: {
            //                             username: true,
            //                             email: true,
            //                             avatarImg: true,
            //                         },
            //                     },
            //                     units: {
            //                         include: {
            //                             creator: {
            //                                 select: {
            //                                     username: true,
            //                                     email: true,
            //                                     avatarImg: true,
            //                                 },
            //                             },
            //                             unitDocs: {
            //                                 include: {
            //                                     creator: {
            //                                         select: {
            //                                             username: true,
            //                                             email: true,
            //                                             avatarImg: true,
            //                                         },
            //                                     },
            //                                 },
            //                             },
            //                         },
            //                     },
            //                 },
            //             },
            //         },
            //     },
            // },
        });

        return institute; // Prisma returns plain objects by default
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error for better error handling
    }
}