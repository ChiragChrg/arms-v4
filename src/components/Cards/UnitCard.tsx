import { UnitTypes } from '@/store/types'
import { BookOpenTextIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AvatarImage from '../CustomUI/AvatarImage'

type UnitCardProps = {
    unit: UnitTypes
    path: string
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, path }) => {
    return (
        <Link
            href={path}
            key={unit.id}
            className="flex flex-col justify-between gap-2 w-full h-full rounded-md radialGradient radialGradientDark p-2">
            <div className="flex justify-center items-center gap-4">
                <div className="w-fit bg-primary/80 p-4 rounded-full text-white">
                    <BookOpenTextIcon size='30' />
                </div>

                <div className="flex flex-col items-center flex-1">
                    <span className="text-[1.4em] font-medium">{unit.unitName}</span>
                    <p className="w-full text-center text-[0.925em] opacity-80">{unit.unitDesc}</p>

                    <div className="w-full flex justify-end items-center gap-2 mt-5">
                        <AvatarImage url={unit.creator?.image} size={20} />
                        <span className='text-[0.75em]'>{unit.creator?.name}</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[1px] bg-white/20"></div>

            <div className="flex justify-around items-center gap-2">
                <div className='flex flex-col items-center text-[0.8em]'>
                    <span className='text-[1rem] font-bold'>{unit.documents?.length || 0}</span> Documents
                </div>
            </div>
        </Link>
    )
}

export default UnitCard