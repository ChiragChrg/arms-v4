"use client";

import Link from 'next/link'
import MobileHeader from '@/components/MobileHeader'
import NavRoute from '@/components/NavRoutes'
import { RectLoader } from '@/components/CustomUI/Skeletons'
import { PlusIcon } from 'lucide-react'
import { useSelector } from 'react-redux';
import { SEL_User, useGetAllInstitutionsQuery } from '@/store';
import InstituteCard from '@/components/Cards/InstituteCard';

const Institutions = () => {
    const { user } = useSelector(SEL_User);

    // Fetch all institutions
    const { data: institutions, isLoading } = useGetAllInstitutionsQuery({});

    return (
        <section className='section_style pb-4'>
            <NavRoute routes={["Institutions"]} />
            <MobileHeader />

            <div className="flex justify-between items-center mt-2">
                <h1 className='text-[2em] font-medium'>Institutions</h1>
                {user?.isApproved &&
                    <Link href="./institutions/create" className='flex_center gap-2 text-[1em] bg-primary text-white rounded-sm px-2 py-1.5'>
                        <PlusIcon />
                        <span>Create</span>
                        <span className='hidden sm:block'>Institution</span>
                    </Link>
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-[1.25em] w-full mt-4">
                {!isLoading ?
                    institutions?.map(institute => (
                        <InstituteCard key={institute.id} institute={institute} />
                    ))
                    :
                    <>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <RectLoader key={index} height='11em' radius={0.375} />
                        ))}
                    </>
                }
            </div>
        </section>
    )
}

export default Institutions