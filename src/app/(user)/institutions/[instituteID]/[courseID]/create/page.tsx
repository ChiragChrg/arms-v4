"use client"
import { FormEvent, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from "next/image"
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import { CourseTypes } from '@/store/types'
import { Button } from '@/components/ui/button'
import { SEL_User, useCreateSubjectMutation, useGetAllCoursesQuery } from '@/store'

import toast from 'react-hot-toast'
import { NewCourseVector } from '@/assets/SVGs'
import OpenBookSVG from '@/assets/Icons/OpenBookSVG'
import { Loader2Icon, PlusIcon, User2Icon } from 'lucide-react'

type Params = {
    instituteID: string,
    courseID: string,
}

const CreateSubject = () => {
    const [subjectName, setSubjectName] = useState<string>("")
    const [subjectDesc, setSubjectDesc] = useState<string>("")
    const [isInvalid, setIsInvalid] = useState<boolean>(false)

    const params = useParams<Params>()
    const router = useRouter()

    // Get User Data
    const { userData: user } = useSelector(SEL_User);
    const { data: course } = useGetAllCoursesQuery({});

    // Create Subject Mutation Handler
    const [createSubject, { isLoading }] = useCreateSubjectMutation();

    // Get Institute Data
    const { id: courseId, courseName } = useMemo(() => {
        return course?.find((obj: CourseTypes) => obj.courseName === params?.courseID.replaceAll("-", " ")) as CourseTypes;
    }, [params?.courseID, course])

    const HandleCreateSubject = async (e: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        if (isInvalid) return;

        try {
            if (courseName.toLowerCase() === subjectName.toLowerCase())
                throw new Error("Subject name cannot be same as course name!")

            const res = await createSubject({
                subjectName,
                subjectDesc,
                courseId,
                creatorId: user.id
            }).unwrap();

            if (res.status === 201) {
                toast.success("Subject Created Successfully!");
                router.push(`/institutions/${params?.instituteID}/${params?.courseID}`);
            } else {
                toast.error(res.message);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || "An error occurred while creating the course.";
            toast.error(errorMessage);
        }
    }

    // Check if subjectName matches the regex pattern
    const validateSubjectName = debounce((subjectName: string) => {
        if (/^[a-zA-Z0-9\s]*$/.test(subjectName)) {
            setIsInvalid(false);
            setSubjectName(subjectName.trim());
        } else {
            setIsInvalid(true);
        }
    }, 300);

    return (
        <section className='section_style'>
            <NavRoute routes={[
                "Institutions",
                `Institutions/${params?.instituteID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}/Create`
            ]} />
            <MobileHeader />

            <h1 className="text-[1.8em] sm:text-[2em] 2xl:text-[3em] font-medium my-2 text-center">
                Create new <span className="text-primary">Subject</span>
            </h1>

            <div className="flex justify-around items-center flex-col-reverse lg:flex-row gap-6 mt-24">
                <form onSubmit={HandleCreateSubject} className='flex flex-col gap-3 2xl:gap-4'>
                    <label className="relative min-w-[350px]">
                        <span className='text-[0.9em] bg-background/0 px-1'>Subject Name</span>

                        <div
                            style={isInvalid ? { borderColor: "rgb(239 68 68)" } : {}}
                            className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                            <input
                                type="text"
                                required={true}
                                placeholder='Enter Subject Name'
                                onChange={(e) => validateSubjectName(e?.target?.value)}
                                className='text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <OpenBookSVG size="24" className="absolute right-2 text-slate-400" />
                        </div>

                        <span
                            className='text-[0.8em] ml-1 text-red-500'
                            style={{ visibility: isInvalid ? "visible" : "hidden" }}>
                            Cannot contain special characters
                        </span>
                    </label>

                    <label className="relative min-w-[350px]">
                        <span className='text-[0.9em] bg-background/0 px-1'>Description</span>

                        <div className="flex flex-col border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                            <textarea
                                rows={2}
                                placeholder='Enter Subject Description'
                                onChange={(e) => setSubjectDesc(e?.target?.value)}
                                maxLength={40}
                                required={true}
                                className='resize-none text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <p className='w-full text-right text-[0.8em] text-slate-400 px-1'>{subjectDesc.length}/40</p>
                        </div>
                    </label>

                    <label className="relative min-w-[350px]">
                        <span className='text-[0.9em] bg-background/0 px-1'>Creator</span>

                        <div className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                            <input
                                type="text"
                                required={true}
                                defaultValue={user.name || ""}
                                disabled={true}
                                className='text-[1em] w-full bg-background/0 text-slate-400 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <User2Icon size={24} className="absolute right-2 text-slate-400" />
                        </div>
                    </label>

                    <Button type='submit' className='flex_center gap-4 text-white' disabled={isLoading || isInvalid}>
                        {isLoading ?
                            <Loader2Icon className='animate-spin' />
                            : <PlusIcon />
                        }
                        Create Subject
                    </Button>
                </form>

                <Image src={NewCourseVector} alt='NewCourseVector' className='w-[280px] sm:w-[400px] 2xl:w-[550px]' />
            </div>
        </section>
    )
}

export default CreateSubject