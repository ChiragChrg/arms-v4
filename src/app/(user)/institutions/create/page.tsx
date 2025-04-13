"use client";

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import { Button } from '@/components/ui/button'
import { debounce } from 'lodash';
import { useSelector } from 'react-redux'
import { SEL_User, useCreateInstitutionMutation } from '@/store'

import toast from 'react-hot-toast'
import Image from "next/image"
import { NewInstituteVector } from '@/assets/SVGs'
import BuildingSVG from '@/assets/Icons/BuildingSVG'
import { Loader2Icon, PlusIcon, User2Icon } from 'lucide-react'

const CreateInstitute = () => {
    const [instituteName, setInstituteName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [isInvalid, setIsInvalid] = useState<boolean>(false)
    const router = useRouter()

    // Get User Data
    const { user } = useSelector(SEL_User);

    // Create Institute Mutation Handler
    const [createInstitution, { isLoading }] = useCreateInstitutionMutation();

    const HandleCreateInstitute = async (e: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (isInvalid) return;

        try {
            await createInstitution({
                instituteName,
                description,
                creatorId: user.id
            }).unwrap();

            toast.success("Institute Created Successfully!");
            router.push("/institutions");
        } catch (error) {
            toast.error((error as { data?: { error?: string } })?.data?.error || "Failed to create institution");
            console.error(error);
        }
    }

    // Check if institutename matches the regex pattern with debounce
    const validateInstituteName = debounce((instituteName: string) => {
        if (/^[a-zA-Z0-9\s]*$/.test(instituteName)) {
            setIsInvalid(false);
            setInstituteName(instituteName.trim());
        } else {
            setIsInvalid(true);
        }
    }, 300);

    return (
        <section className='section_style'>
            <NavRoute routes={["Institutions", "Institutions/Create"]} />
            <MobileHeader />

            <h1 className="text-[1.8em] sm:text-[2em] 2xl:text-[3em] font-medium my-2 text-center mt-4">
                Create new <span className="text-primary">Institution</span>
            </h1>

            <div className="w-full h-[80%] flex justify-around items-center flex-col-reverse lg:flex-row gap-6">
                <form onSubmit={HandleCreateInstitute} className='flex flex-col gap-3 2xl:gap-4'>
                    <label className="relative min-w-[350px]">
                        <p className='text-[0.9em] bg-background/0 px-1'>Institute Name</p>

                        <div
                            style={isInvalid ? { borderColor: "rgb(239 68 68)" } : {}}
                            className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                            <input
                                type="text"
                                required={true}
                                placeholder='Enter Institute Name'
                                onChange={(e) => validateInstituteName(e.target.value)}
                                className='text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <BuildingSVG size="24" className="absolute right-2 text-slate-400" />
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
                                rows={3}
                                maxLength={80}
                                required={true}
                                placeholder='Enter Institute Description'
                                onChange={(e) => setDescription(e?.target?.value)}
                                className='resize-none text-[1em] w-full bg-background/0 px-2 py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                            <p className='w-full text-right text-[0.8em] text-slate-400 px-1'>{description.length}/80</p>
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
                        Create Institute
                    </Button>
                </form>

                <Image src={NewInstituteVector} alt='NewInstituteVector' className='w-[280px] sm:w-[400px] 2xl:w-[550px]' />
            </div>
        </section>
    )
}

export default CreateInstitute