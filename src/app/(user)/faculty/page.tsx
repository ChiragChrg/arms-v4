"use client"
import { useLayoutEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SEL_User, useGetAllFacultyQuery } from '@/store'
import { useSelector } from 'react-redux'
import { UserTypes } from '@/store/types'
import { formatDate } from '@/utils/commonUtils'

import toast from 'react-hot-toast'
import { User2, UserCheck } from 'lucide-react'
import MobileHeader from '@/components/MobileHeader'
import AvatarImage from '@/components/CustomUI/AvatarImage'
import ManageFaculty from '@/components/CustomUI/ManageFaculty'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const Faculty = () => {
    const { isAdmin, isLoading } = useSelector(SEL_User);
    const router = useRouter()

    // Redirect NON-ADMIN users back to dashboard
    useLayoutEffect(() => {
        if (!isLoading && !isAdmin) {
            toast.error("Unauthorized Access!")
            router.replace("/dashboard")
        }
    }, [isAdmin, router, isLoading])

    // Fetch all faculty data
    const { data: facultyList } = useGetAllFacultyQuery({});

    // Pending Approval Count
    const pendingApprovalCount = useMemo(() => facultyList?.filter((faculty: UserTypes) => !faculty?.isApproved).length || 0, [facultyList])

    if (isAdmin)
        return (
            <section className='section_style'>
                <MobileHeader />

                <div className="flex justify-between items-center">
                    <h1 className='text-[1.6em] sm:text-[2em] font-bold'>
                        <span className='hidden sm:inline'>Approved</span>
                        <span className="sm:text-primary"> Faculty</span>
                    </h1>

                    {isAdmin &&
                        <Link href="./faculty/request" className='flex_center gap-2 text-[1em] bg-primary text-white rounded-sm px-2 py-1.5'>
                            <UserCheck />
                            <span className='hidden sm:block'>Pending</span>
                            <div className='relative flex_center gap-2'>Request
                                {pendingApprovalCount != 0 &&
                                    <span className='flex_center w-6 aspect-square rounded-full bg-white text-primary font-bold text-[0.7em]'>{pendingApprovalCount}</span>}
                            </div>
                        </Link>
                    }
                </div>

                {/* Table Ui for Desktop screen */}
                <Table className='hidden xl:table mt-4'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-2 sm:px-4 py-2">Username</TableHead>
                            <TableHead className="px-2 sm:px-4 py-2">Email</TableHead>
                            <TableHead className='px-2 sm:px-4 py-2 sm:table-cell'>DOJ</TableHead>
                            <TableHead className="px-2 sm:px-4 py-2 w-fit text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {facultyList?.map((faculty, index) => {
                            if (!faculty.isApproved) return
                            const showActionBtn = faculty.id === process.env.NEXT_PUBLIC_ARMS_ADMIN_UID

                            return (
                                <TableRow key={index}>
                                    <TableCell className="px-2 sm:px-4 py-2 flex items-center gap-3">
                                        <AvatarImage url={faculty.image} size={40} />
                                        <span className='font-medium capitalize'>{faculty.name}</span>
                                    </TableCell>
                                    <TableCell className="px-2 sm:px-4 py-2">{faculty.email}</TableCell>
                                    <TableCell className='px-2 sm:px-4 py-2 sm:table-cell'>{formatDate(faculty.createdAt)}</TableCell>
                                    <TableCell className='px-2 sm:px-4 py-2 sm:table-cell text-center'>
                                        {showActionBtn && <ManageFaculty
                                            facultyName={faculty.name}
                                            facultyId={faculty.id}
                                        />}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                {/* Card Ui for Mobile screen */}
                <div className="grid xl:hidden grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {facultyList?.map((faculty, index) => {
                        if (!faculty.isApproved) return
                        const showActionBtn = faculty.id === process.env.NEXT_PUBLIC_ARMS_ADMIN_UID;

                        return (
                            <div key={index} className="flex justify-between items-center border border-secondary rounded-md px-1 py-0.5">
                                <div className="flex items-center gap-4">
                                    {faculty.image ?
                                        <Image
                                            src={faculty.image}
                                            alt='User_Avatar'
                                            width={40}
                                            height={40}
                                            loading='eager'
                                            className='rounded-full'
                                        />
                                        :
                                        <div className="bg-slate-500 w-fit p-1.5 rounded-full">
                                            <User2 size={30} />
                                        </div>
                                    }

                                    <div className="flex flex-col">
                                        <span className='font-medium capitalize'>{faculty.name}</span>
                                        <span className='text-[0.8em] opacity-80'>{faculty.email}</span>
                                    </div>
                                </div>

                                {showActionBtn && <ManageFaculty
                                    facultyName={faculty.name}
                                    facultyId={faculty.id}
                                />}
                            </div>
                        )
                    })}
                </div>
            </section>
        )
}

export default Faculty