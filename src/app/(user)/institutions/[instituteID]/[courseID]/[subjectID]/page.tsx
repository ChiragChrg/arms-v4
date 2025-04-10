"use client"
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { SEL_User, useGetAllSubjectsQuery } from '@/store'
import { SubjectTypes } from '@/store/types'

import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import AvatarImage from '@/components/CustomUI/AvatarImage'
import DropdownSettings from '@/components/CustomUI/DropdownSettings'
import { CircleLoader, RectLoader } from '@/components/CustomUI/Skeletons'

import OpenBookSVG from '@/assets/Icons/OpenBookSVG'
import toast from 'react-hot-toast'
import { BookOpenTextIcon, PlusIcon } from 'lucide-react'

type Params = {
    instituteID: string,
    courseID: string,
    subjectID: string,
}

const SubjectInfo = () => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const pathname = usePathname()
    const params = useParams<Params>()
    const router = useRouter()

    // Get User Data
    const { userData: user, isAdmin } = useSelector(SEL_User);

    // Get All Subject Data
    const { data: subjectList, isLoading } = useGetAllSubjectsQuery({});

    // Get Current Subject Data
    const subject = useMemo(() => subjectList?.find((subject) => subject.subjectName.toLowerCase().replaceAll(" ", "-") === params?.subjectID.toLowerCase()) || {} as SubjectTypes, [subjectList, params?.subjectID]);

    // If subject not found, redirect to 404 page
    useEffect(() => {
        if (!isLoading && !subject) {
            toast.error("Subject not found")
            router.push("/404")
        }
    }, [subject, isLoading, router])

    // Grant DELETE access if user is ADMIN or the CREATOR
    useEffect(() => {
        if (isAdmin || user.id === subject?.creatorId)
            setIsAuthorized(true)
        else
            setIsAuthorized(false)
    }, [user, isAdmin, subject?.creatorId])

    // Count documents
    const docsCount = useMemo(() => {
        let totalDocs = 0

        if (subject) {
            subject?.units?.forEach((unit) => {
                totalDocs += unit?.documents?.length || 0
            })
        }

        return totalDocs
    }, [subject])

    return (
        <section className='section_style'>
            <NavRoute routes={[
                "Institutions",
                `Institutions/${params?.instituteID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}`,
                `.${pathname}`
            ]} />
            <MobileHeader />

            <div className="relative flex items-center gap-4 bg-radialGradient dark:bg-radialGradientDark sm:[background:hsl(var(--primary)/0.3)] rounded-md p-2 sm:p-3 mt-4">
                <div className="absolute -top-2 -left-2 sm:top-auto sm:left-auto sm:relative w-fit sm:bg-primary/80 p-6 rounded-full text-white/40 dark:text-white/10 sm:text-white dark:sm:text-white">
                    <OpenBookSVG size='80' />
                </div>

                <DropdownSettings
                    title='Subject'
                    toDeleteName={subject?.subjectName}
                    isAuthorized={isAuthorized}
                    userID={user.id}
                    documentData={subject} />

                <div className="w-full flex_center flex-col gap-2 px-4 mt-8 sm:mt-0">
                    <div className="flex_center flex-col gap-2 w-full">
                        {!isLoading ?
                            <>
                                <h1 className='text-[1.8em] sm:text-[2em] font-medium drop-shadow'>{subject?.subjectName}</h1>
                                <p className='opacity-90 text-center'>{subject?.subjectDesc}</p>
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
                                <span>Units: {subject?.units?.length || 0}</span>
                                <span>Documents: {docsCount}</span>
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
                                <AvatarImage url={subject.creator?.image} size={25} />
                                <span>{subject.creator?.name}</span>
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
                <h2 className='text-[1.7em] font-medium'>Units</h2>
                {user?.isApproved &&
                    <Link href={`./${subject?.subjectName?.toLowerCase().replaceAll(" ", "-")}/create`} className='flex_center gap-2 text-[1em] bg-primary text-white rounded-sm px-2 py-1.5'>
                        <PlusIcon />
                        <span>Create</span>
                        <span className='hidden sm:block'>Unit</span>
                    </Link>
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.25em]">
                {subject?.units?.map((obj, index) => (
                    <Link
                        href={`${pathname}/${obj?.unitName?.toLowerCase().replaceAll(" ", "-")}`}
                        key={index}
                        className="flex_center flex-col w-full h-full rounded-md bg-radialGradient dark:bg-radialGradientDark px-2 py-4">
                        <div className="w-fit bg-primary/80 p-4 rounded-full mb-4 text-white">
                            <BookOpenTextIcon size='40' />
                        </div>
                        <span className="text-[1.4em] font-medium">{obj?.unitName}</span>
                        <p className="w-full max-h-[45px] text-center text-[0.925em] opacity-80">{obj?.unitDesc}</p>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default SubjectInfo