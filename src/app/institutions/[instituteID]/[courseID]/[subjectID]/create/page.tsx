"use client";

import { FormEvent, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { debounce } from 'lodash'
import Image from "next/image"
import { Button } from '@/components/ui/button'
import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import { SubjectTypes } from '@/store/types'
import { SEL_User, useCreateUnitMutation, useGetAllSubjectsQuery } from '@/store'

import toast from 'react-hot-toast'
import { NewUnitVector } from '@/assets/SVGs'
import { BookOpenTextIcon, Loader2Icon, PlusIcon, User2Icon } from 'lucide-react'

type Params = {
    instituteID: string,
    courseID: string,
    subjectID: string,
}

const CreateUnit = () => {
    const [unitName, setUnitName] = useState<string>("")
    const [unitDesc, setUnitDesc] = useState<string>("")
    const [isInvalid, setIsInvalid] = useState<boolean>(false)
    const params = useParams<Params>()
    const router = useRouter()

    // Get User Data
    const { user } = useSelector(SEL_User);
    const { data: subject } = useGetAllSubjectsQuery({});

    // Get Subject Data
    const currentSubject = useMemo(() => {
        return subject?.find((obj: SubjectTypes) => obj.subjectName.toLowerCase() === params?.subjectID.replaceAll("-", " ")) as SubjectTypes;
    }, [params?.subjectID, subject])

    // Create Unit Mutation Handler
    const [createUnit, { isLoading }] = useCreateUnitMutation();

    const HandleCreateUnit = async (e: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        if (isInvalid) return;

        try {
            if (currentSubject.subjectName.toLowerCase() === unitName.toLowerCase())
                throw new Error("Unit name cannot be same as Subject name!")

            await createUnit({
                unitName,
                unitDesc,
                subjectId: currentSubject.id,
                creatorId: user.id
            }).unwrap();

            toast.success("Unit Created Successfully!");
            router.push(`/institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}`);
        } catch (error) {
            toast.error((error as { data?: { error?: string } })?.data?.error || "Failed to create Unit");
            console.error(error);
        }
    }

    // Check if unitName matches the regex pattern
    const validateUnitName = debounce((unitName: string) => {
        if (/^[a-zA-Z0-9\s]*$/.test(unitName)) {
            setIsInvalid(false);
            setUnitName(unitName.trim());
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
                `Institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}/Create`
            ]} />
            <MobileHeader />

            <h1 className="text-[1.8em] sm:text-[2em] 2xl:text-[3em] font-medium my-2 text-center mt-4">
                Create new <span className="text-primary">Unit</span>
            </h1>

            <div className="w-full h-[80%] flex justify-around items-center flex-col-reverse lg:flex-row gap-6">
                <form onSubmit={HandleCreateUnit} className='flex flex-col gap-3 2xl:gap-4'>
                    <label className="relative min-w-[350px]">
                        <span className='text-[0.9em] bg-background/0 px-1'>Unit Name</span>

                        <div
                            style={isInvalid ? { borderColor: "rgb(239 68 68)" } : {}}
                            className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                            <input
                                type="text"
                                required={true}
                                placeholder='Enter Unit Name'
                                onChange={(e) => validateUnitName(e?.target?.value)}
                                className='text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <BookOpenTextIcon size="24" className="absolute right-2 text-slate-400" />
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
                                placeholder='Enter Unit Description'
                                onChange={(e) => setUnitDesc(e?.target?.value)}
                                maxLength={40}
                                required={true}
                                className='resize-none text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <p className='w-full text-right text-[0.8em] text-slate-400 px-1'>{unitDesc.length}/40</p>
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
                        Create Unit
                    </Button>
                </form>

                <Image src={NewUnitVector} alt='NewCourseVector' className='w-[280px] sm:w-[400px] 2xl:w-[550px]' />
            </div>
        </section>
    )
}

export default CreateUnit