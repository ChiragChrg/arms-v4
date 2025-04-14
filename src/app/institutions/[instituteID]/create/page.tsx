"use client";

import { FormEvent, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { InstitutionTypes } from '@/store/types'
import Image from "next/image"
import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import { Button } from '@/components/ui/button'
import { debounce } from 'lodash'

import toast from 'react-hot-toast'
import { NewCourseVector } from '@/assets/SVGs'
import BookStackSVG from '@/assets/Icons/BookStackSVG'
import { Loader2Icon, PlusIcon, User2Icon } from 'lucide-react'
import { SEL_User, useCreateCourseMutation, useGetAllInstitutionsQuery } from '@/store'

type Params = {
    instituteID: string,
}

const CreateCourse = () => {
    const [courseName, setCourseName] = useState<string>("")
    const [courseDesc, setCourseDesc] = useState<string>("")
    const [isInvalid, setIsInvalid] = useState<boolean>(false)
    const params = useParams<Params>()
    const router = useRouter()

    // Get User Data
    const { user } = useSelector(SEL_User);
    const { data: institute } = useGetAllInstitutionsQuery({});

    // Get Institute Data
    const currentInstitute = useMemo(() => {
        return institute?.find((obj: InstitutionTypes) => obj.instituteName.toLowerCase() === params?.instituteID.replaceAll("-", " ")) as InstitutionTypes;
    }, [params?.instituteID, institute])

    // Create Course Mutation Handler
    const [createCourse, { isLoading }] = useCreateCourseMutation();

    const HandleCreateCourse = async (e: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (isInvalid) return;

        try {
            if (currentInstitute.instituteName.toLowerCase() === courseName.toLowerCase())
                throw new Error("Course name cannot be same as institute name!");

            await createCourse({
                courseName,
                courseDesc,
                instituteId: currentInstitute.id,
                creatorId: user.id
            }).unwrap();

            toast.success("Course Created Successfully!");
            router.push(`/institutions/${params?.instituteID}`);
        } catch (error) {
            toast.error((error as { data?: { error?: string } })?.data?.error || "Failed to create Course");
            console.error(error);
        }
    }

    // Check if courseName matches the regex pattern
    const validateCourseName = debounce((courseName: string) => {
        if (/^[a-zA-Z0-9\s]*$/.test(courseName)) {
            setIsInvalid(false);
            setCourseName(courseName.trim());
        } else {
            setIsInvalid(true);
        }
    }, 300);

    return (
        <section className='section_style'>
            <NavRoute routes={["Institutions", `Institutions/${params?.instituteID}`, `Institutions/${params?.instituteID}/Create`]} />
            <MobileHeader />

            <h1 className="text-[1.8em] sm:text-[2em] 2xl:text-[3em] font-medium my-2 text-center mt-4">
                Create new <span className="text-primary">Course</span>
            </h1>

            <div className="w-full h-[80%] flex justify-around items-center flex-col-reverse lg:flex-row gap-6 mt-20">
                <form onSubmit={HandleCreateCourse} className='flex flex-col gap-3 2xl:gap-4'>
                    <label className="relative min-w-[350px]">
                        <span className='text-[0.9em] bg-background/0 px-1'>Course Name</span>

                        <div
                            style={isInvalid ? { borderColor: "rgb(239 68 68)" } : {}}
                            className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                            <input
                                type="text"
                                required={true}
                                placeholder='Enter Course Name'
                                onChange={(e) => validateCourseName(e?.target?.value)}
                                className='text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <BookStackSVG size="24" className="absolute right-2 text-slate-400" />
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
                                placeholder='Enter Course Description'
                                onChange={(e) => setCourseDesc(e?.target?.value)}
                                maxLength={40}
                                required={true}
                                className='resize-none text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <p className='w-full text-right text-[0.8em] text-slate-400 px-1'>{courseDesc.length}/40</p>
                        </div>
                    </label>

                    <label className="relative min-w-[350px]">
                        <span className='text-[0.9em] bg-background/0 px-1'>Creator</span>

                        <div className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                            <input
                                type="text"
                                required={true}
                                defaultValue={user.name}
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
                        Create Course
                    </Button>
                </form>

                <Image src={NewCourseVector} alt='NewCourseVector' className='w-[280px] sm:w-[400px] 2xl:w-[550px]' />
            </div>
        </section>
    )
}

export default CreateCourse