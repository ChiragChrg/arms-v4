"use client";

import { useEffect, useMemo, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import AvatarImage from '@/components/CustomUI/AvatarImage'
import DropdownSettings from '@/components/CustomUI/DropdownSettings'
import { CircleLoader, RectLoader } from '@/components/CustomUI/Skeletons'

import BuildingSVG from '@/assets/Icons/BuildingSVG'
import BookStackSVG from '@/assets/Icons/BookStackSVG'
import toast from 'react-hot-toast'
import { PlusIcon } from 'lucide-react'
import { useSelector } from 'react-redux';
import { SEL_User, useGetAllInstitutionsQuery } from '@/store';

type Params = {
    instituteID: string,
}

const InstituteInfo = () => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const pathname = usePathname()
    const params = useParams<Params>()
    const router = useRouter()

    // Get User Data
    const { userData: user, isAdmin } = useSelector(SEL_User);

    // Get All Institutions Data
    const { data: institutionList, isLoading } = useGetAllInstitutionsQuery({});

    // Get Current Institute Data
    const institute = useMemo(() => institutionList?.find((obj) => obj?.instituteName?.toLowerCase().replaceAll(" ", "-") === params?.instituteID), [institutionList, params?.instituteID]);

    // Redirect to 404 if institute not found
    useEffect(() => {
        if (!isLoading && !institute) {
            toast.error("Institute not found!")
            router.push("/404")
            return;
        }
    }, [isLoading, institute, router])

    // Course,Subjects, Docs Count
    const contentCount = useMemo(() => {
        let totalSubject = 0;
        let totalDocs = 0;

        if (institute) {
            institute?.courses?.forEach((course) => {
                totalSubject += course?.subjects?.length || 0;

                course?.subjects?.forEach((subject) => {
                    subject?.units?.forEach((unit) => {
                        totalDocs += unit?.documents?.length || 0
                    })
                })
            });
        }

        return {
            subjectCount: totalSubject,
            docsCount: totalDocs,
        };
    }, [institute]);

    // Grant DELETE access if user is ADMIN or the CREATOR
    useEffect(() => {
        if (isAdmin || user.id === institute?.creatorId)
            setIsAuthorized(true)
        else
            setIsAuthorized(false)
    }, [user, isAdmin, institute?.creatorId])

    return (
        <section className='section_style'>
            <NavRoute routes={["Institutions", `.${pathname}`]} />
            <MobileHeader />

            <div className="relative flex items-center gap-4 bg-radialGradient dark:bg-radialGradientDark sm:[background:hsl(var(--primary)/0.3)] rounded-md p-2 sm:p-3 mt-4">
                <div className="absolute -top-2 -left-2 sm:top-auto sm:left-auto sm:relative w-fit sm:bg-primary/80 p-6 rounded-full text-white/40 dark:text-white/10 sm:text-white dark:sm:text-white">
                    <BuildingSVG size='80' />
                </div>

                <DropdownSettings
                    title='Institute'
                    toDeleteName={institute?.instituteName || ''}
                    isAuthorized={isAuthorized}
                    userID={user.id}
                    documentData={institute} />

                <div className="w-full flex_center flex-col gap-2 px-4 mt-8 sm:mt-0">
                    <div className="flex_center flex-col gap-2 w-full">
                        {!isLoading ?
                            <>
                                <h1 className='text-[1.8em] sm:text-[2em] font-medium drop-shadow'>{institute?.instituteName}</h1>
                                <p className='opacity-90 text-center'>{institute?.description}</p>
                            </>
                            :
                            <>
                                <RectLoader height='45px' className='mt-3 sm:mt-0 max-w-[600px]' />
                                <RectLoader />
                            </>
                        }
                    </div>

                    <span className="w-full h-[2px] bg-slate-400/40"></span>

                    <div className="w-full flex justify-between sm:justify-center items-center gap-2 sm:gap-10 text-[0.9em]">
                        {!isLoading ?
                            <>
                                <span>Courses: {institute?.courses?.length || 0}</span>
                                <span>Subjects: {contentCount.subjectCount}</span>
                                <span>Documents: {contentCount.docsCount}</span>
                            </>
                            :
                            <>
                                <RectLoader />
                                <RectLoader />
                                <RectLoader />
                            </>
                        }
                    </div>

                    <div className="w-full flex justify-end items-center gap-2 text-[0.8em]">
                        <span>Creator : </span>
                        {!isLoading ?
                            <div className="flex_center gap-2">
                                <AvatarImage url={institute?.creator?.image} size={25} />

                                <span>{institute?.creator?.name}</span>
                            </div>
                            :
                            <div className="w-[150px] flex_center gap-2">
                                <CircleLoader size='25px' />
                                <RectLoader height='20px' />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center py-4">
                <h2 className='text-[1.7em] font-medium'>Courses</h2>
                {user?.isApproved &&
                    <Link href={`./${institute?.instituteName?.toLowerCase().replaceAll(" ", "-")}/create`} className='flex_center gap-2 text-[1em] bg-primary text-white rounded-sm px-2 py-1.5'>
                        <PlusIcon />
                        <span>Create</span>
                        <span className='hidden sm:block'>Course</span>
                    </Link>
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.25em] mb-6">
                {!isLoading ?
                    institute?.courses?.map((course, index) => (
                        <Link
                            href={`${pathname}/${course?.courseName?.toLowerCase().replaceAll(" ", "-")}`}
                            key={index}
                            className="flex_center flex-col w-full h-full rounded-md bg-radialGradient dark:bg-radialGradientDark px-2 py-4">
                            <div className="w-fit bg-primary/80 p-4 rounded-full mb-4 text-white">
                                <BookStackSVG size='40' />
                            </div>
                            <span className="text-[1.4em] font-medium">{course?.courseName}</span>
                            <p className="w-full max-h-[45px] text-center text-[0.925em] opacity-80">{course?.courseDesc}</p>
                        </Link>
                    ))
                    :
                    <>
                        <RectLoader height='11em' radius={0.375} />
                        <RectLoader height='11em' radius={0.375} />
                        <RectLoader height='11em' radius={0.375} />
                        <RectLoader height='11em' radius={0.375} />
                        <RectLoader height='11em' radius={0.375} />
                        <RectLoader height='11em' radius={0.375} />
                    </>
                }
            </div>
        </section>
    )
}

export default InstituteInfo