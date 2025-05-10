import { BookStackSVG } from '@/assets/Icons'
import { CourseTypes } from '@/store/types'
import Link from 'next/link'
import React from 'react'
import AvatarImage from '../CustomUI/AvatarImage'

type CourseCardProps = {
    course: CourseTypes
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <Link
            href={`./institutions/${course.courseName?.toLowerCase().replaceAll(" ", "-")}`}
            key={course.id}
            className="flex flex-col justify-between gap-2 w-full h-full rounded-md radialGradient radialGradientDark p-2">
            <div className="flex justify-center items-center gap-4">
                <div className="w-fit bg-primary/80 p-4 rounded-full text-white">
                    <BookStackSVG size='30' />
                </div>

                <div className="flex flex-col items-center flex-1">
                    <span className="text-[1.4em] font-medium">{course.courseName}</span>
                    <p className="w-full text-center text-[0.925em] opacity-80">{course.courseDesc}</p>

                    <div className="w-full flex justify-end items-center gap-2 mt-5">
                        <AvatarImage url={course.creator?.image} size={20} />
                        <span className='text-[0.75em]'>{course.creator?.name}</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[1px] bg-white/20"></div>

            <div className="flex justify-around items-center gap-2">
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{course.counts.subjects}</span> Subjects
                </div>
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{course.counts.units}</span> Units
                </div>
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{course.counts.documents}</span> Documents
                </div>
            </div>
        </Link>
    )
}

export default CourseCard