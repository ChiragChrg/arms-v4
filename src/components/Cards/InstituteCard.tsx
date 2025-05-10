import { BuildingSVG } from '@/assets/Icons'
import { InstitutionTypes } from '@/store/types'
import Link from 'next/link'
import React from 'react'
import AvatarImage from '../CustomUI/AvatarImage'

type InstituteCardProps = {
    institute: InstitutionTypes
}

const InstituteCard: React.FC<InstituteCardProps> = ({ institute }) => {
    return (
        <Link
            href={`./institutions/${institute.instituteName?.toLowerCase().replaceAll(" ", "-")}`}
            key={institute.id}
            className="flex flex-col justify-between gap-2 w-full h-full rounded-md radialGradient radialGradientDark p-2">
            <div className="flex justify-center items-center gap-4">
                <div className="w-fit bg-primary/80 p-4 rounded-full text-white">
                    <BuildingSVG size='30' />
                </div>

                <div className="flex flex-col items-center flex-1">
                    <span className="text-[1.4em] font-medium">{institute.instituteName}</span>
                    <p className="w-full text-center text-[0.925em] opacity-80">{institute.description}</p>

                    <div className="w-full flex justify-end items-center gap-2 mt-5">
                        <AvatarImage url={institute.creator?.image} size={20} />
                        <span className='text-[0.75em]'>{institute.creator?.name}</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[1px] bg-white/20"></div>

            <div className="flex justify-around items-center gap-2">
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{institute.counts.courses}</span> Courses
                </div>
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{institute.counts.subjects}</span> Subjects
                </div>
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{institute.counts.units}</span> Units
                </div>
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{institute.counts.documents}</span> Documents
                </div>
            </div>
        </Link>
    )
}

export default InstituteCard