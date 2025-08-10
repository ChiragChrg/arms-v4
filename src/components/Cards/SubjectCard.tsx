import { OpenBookSVG } from '@/assets/Icons'
import { SubjectTypes } from '@/store/types'
import Link from 'next/link'
import React from 'react'
import AvatarImage from '../CustomUI/AvatarImage'

type SubjectCardProps = {
    subject: SubjectTypes
    path: string
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, path }) => {
    return (
        <Link
            href={path}
            key={subject.id}
            className="flex flex-col justify-between gap-2 w-full h-full rounded-md radialGradient radialGradientDark p-2">
            <div className="flex justify-center items-center gap-4">
                <div className="w-fit bg-primary/80 p-4 rounded-full text-white">
                    <OpenBookSVG size='30' />
                </div>

                <div className="flex flex-col items-center flex-1">
                    <span className="text-[1.4em] font-medium">{subject.subjectName}</span>
                    <p className="w-full text-center text-[0.925em] opacity-80">{subject.subjectDesc}</p>

                    <div className="w-full flex justify-end items-center gap-2 mt-5">
                        <AvatarImage url={subject.creator?.image} size={20} />
                        <span className='text-[0.75em]'>{subject.creator?.name}</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[1px] bg-white/20"></div>

            <div className="flex justify-around items-center gap-2">
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{subject.counts?.units}</span> Units
                </div>
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{subject.counts?.documents}</span> Documents
                </div>
            </div>
        </Link>
    )
}

export default SubjectCard