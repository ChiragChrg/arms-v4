"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'

import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import AvatarImage from '@/components/CustomUI/AvatarImage'
import DropdownSettings from '@/components/CustomUI/DropdownSettings'
import { CircleLoader, RectLoader } from '@/components/CustomUI/Skeletons'

import BookStackSVG from '@/assets/Icons/BookStackSVG'
import toast from 'react-hot-toast'
import { PlusIcon } from 'lucide-react'
import { SEL_User } from '@/store';
import { useSelector } from 'react-redux';
import { useCourse } from '@/hooks/useCourse';
import SubjectCard from '@/components/Cards/SubjectCard';

type Params = {
    instituteID: string,
    courseID: string
}

const CourseInfo = () => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const pathname = usePathname()
    const params = useParams<Params>()
    const router = useRouter()

    // Get user data
    const { user, isAdmin } = useSelector(SEL_User);

    // Get course data
    const { course, isLoading } = useCourse(params.courseID);

    // If course not found, redirect to 404 page
    useEffect(() => {
        if (!isLoading && !course) {
            toast.error("Course not found")
            router.push("/404")
        }
    }, [course, isLoading, router])

    // Grant DELETE access if user is ADMIN or the CREATOR
    useEffect(() => {
        if (isAdmin || user.id === course?.creatorId)
            setIsAuthorized(true)
        else
            setIsAuthorized(false)
    }, [user, isAdmin, course]);

    return (
        <section className='section_style'>
            <NavRoute routes={["Institutions", `Institutions/${params?.instituteID}`, `.${pathname}`]} />
            <MobileHeader />

            <div className="relative flex items-center gap-4 radialGradient radialGradientDark sm:[background:hsl(var(--primary)/0.3)] rounded-md p-2 sm:p-3 mt-4">
                <div className="absolute -top-2 -left-2 sm:top-auto sm:left-auto sm:relative w-fit sm:bg-primary/80 p-6 rounded-full text-white/40 dark:text-white/10 sm:text-white dark:sm:text-white">
                    <BookStackSVG size='80' />
                </div>

                {user.id !== "anonymous" &&
                    <DropdownSettings
                        title='Course'
                        deleteName={course?.courseName}
                        isAuthorized={isAuthorized}
                        userId={user.id}
                        documentData={course} />}

                <div className="w-full flex_center flex-col gap-2 px-4 mt-8 sm:mt-0">
                    <div className="flex_center flex-col gap-2 w-full">
                        {!isLoading ?
                            <>
                                <h1 className='text-[1.8em] sm:text-[2em] font-medium drop-shadow'>{course?.courseName}</h1>
                                <p className='opacity-90 text-center'>{course?.courseDesc}</p>
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
                                <span>Subjects: {course.counts.subjects}</span>
                                <span>Units: {course.counts.units}</span>
                                <span>Documents: {course.counts.documents}</span>
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
                                <AvatarImage url={course.creator?.image} size={25} />
                                <span>{course.creator?.name}</span>
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
                <h2 className='text-[1.7em] font-medium'>Subjects</h2>
                {user?.isApproved &&
                    <Link href={`./${course?.courseName?.toLowerCase().replaceAll(" ", "-")}/create`} className='flex_center gap-2 text-[1em] bg-primary text-white rounded-sm px-2 py-1.5'>
                        <PlusIcon />
                        <span>Create</span>
                        <span className='hidden sm:block'>Subject</span>
                    </Link>
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.25em]">
                {course?.subjects?.map((obj, index) => (
                    <SubjectCard key={index} subject={obj} path={`${pathname}/${obj?.subjectName?.toLowerCase().replaceAll(" ", "-")}`} />
                ))}
            </div>
        </section>
    )
}

export default CourseInfo