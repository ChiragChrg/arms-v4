"use client";

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEdgeStore } from '@/lib/edgestore'
import { getDownloadUrl } from '@edgestore/react/utils';
import { useSelector } from 'react-redux';
import { SEL_User, useDeleteDocumentMutation, useGetAllUnitsQuery } from '@/store';
import { UnitTypes } from '@/store/types';

import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'
import AvatarImage from '@/components/CustomUI/AvatarImage'
import DropdownSettings from '@/components/CustomUI/DropdownSettings'
import { CircleLoader, RectLoader } from '@/components/CustomUI/Skeletons'
import { Button } from '@/components/ui/button'

import toast from 'react-hot-toast'
import { BookOpenTextIcon, DownloadCloudIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"

type Params = {
    instituteID: string,
    courseID: string,
    subjectID: string,
    unitID: string
}

type RecentDataType = {
    [key: string]: {
        url: string,
        title: string,
        subtitle: string
    }[]
}

const UnitInfo = () => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const pathname = usePathname()
    const params = useParams<Params>()
    const { edgestore } = useEdgeStore();

    // Get User Data
    const { userData: user, isAdmin } = useSelector(SEL_User);
    const { data: allUnits } = useGetAllUnitsQuery({});

    // Get Current Unit Data
    const unit = useMemo(() => {
        return allUnits?.find((obj: UnitTypes) => obj.unitName === params?.unitID.replaceAll("-", " ")) || {} as UnitTypes;
    }, [params?.unitID, allUnits]);

    // Delete Document Mutation Handler
    const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();

    // Add subject to Recents dash usin LocalStorage
    useEffect(() => {
        if (!unit?.unitName) return

        const newData = {
            url: `./institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}/${params?.unitID}`,
            title: unit?.unitName,
            subtitle: `${params?.instituteID.replaceAll("-", " ")} / ${params?.courseID.replaceAll("-", " ")} / ${params?.subjectID.replaceAll("-", " ")} / ${params?.unitID.replaceAll("-", " ")}`
        }

        const userID = user.id;
        const recentDataUsers: RecentDataType = JSON.parse(localStorage.getItem("arms-recents") as string) || []
        const recentData = recentDataUsers[userID]

        if (!recentData || !Array.isArray(recentData)) {
            const newRecentData = {
                [userID]: [newData]
            }
            localStorage.setItem("arms-recents", JSON.stringify({ ...recentDataUsers, ...newRecentData }))
        } else {
            if (recentData[0]?.title === newData?.title) return //return if curr subject already at index 0

            const oldData = recentData?.find((data) => data?.title === newData?.title)
            if (oldData) {
                //if subject exists, move to top of array ie index 0
                const filteredData = recentData.filter((data) => data?.title !== newData?.title) // remove old data
                filteredData?.unshift(newData) // add back data to top index

                recentDataUsers[userID] = filteredData
                localStorage.setItem("arms-recents", JSON.stringify(recentDataUsers))
            } else {
                // if subject doesnt exisit in array, add to top of array ie index 0
                recentData.unshift(newData)
                if (recentData.length > 6) recentData.pop() //if more than 6, remove data at end

                recentDataUsers[userID] = recentData
                localStorage.setItem("arms-recents", JSON.stringify(recentDataUsers))
            }
        }
    }, [unit, params, user])

    // Deleting files
    const deleteFiles = async (urlToDelete: string, fileId: string) => {
        const deleteToast = toast.loading("Deleting Document")
        try {
            await edgestore.publicFiles.delete({
                url: urlToDelete,
            });

            // Delete from database
            const res = await deleteDocument(fileId).unwrap();

            if (res.status === 200) {
                toast.success("Document Deleted 👍🏻", { id: deleteToast })
            }
        } catch (err) {
            console.log("Error while Deleting file: ", err)
            toast.error("Error while Deleting Document", { id: deleteToast })
        } finally {
            setOpen(false)
        }
    }

    // Grant DELETE access if user is ADMIN or the CREATOR
    useEffect(() => {
        if (isAdmin || user.id === unit.creatorId)
            setIsAuthorized(true)
        else
            setIsAuthorized(false)
    }, [user, isAdmin, unit.creatorId])

    // Convert file url to a download link
    const handleDownload = async (fileUrl: string, fileName: string) => {
        const downloadLink = getDownloadUrl(fileUrl, fileName)

        const Button = document.createElement('a');
        Button.href = downloadLink;
        Button.click();
    }

    return (
        <section className='section_style'>
            <NavRoute routes={[
                "Institutions",
                `Institutions/${params?.instituteID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}`,
                `.${pathname}`]} />
            <MobileHeader />

            <div className="relative flex items-center gap-4 bg-radialGradient dark:bg-radialGradientDark sm:[background:hsl(var(--primary)/0.3)] rounded-md p-2 sm:p-3 mt-4">
                <div className="absolute -top-2 -left-2 sm:top-auto sm:left-auto sm:relative w-fit sm:bg-primary/80 p-6 rounded-full text-white/40 dark:text-white/10 sm:text-white dark:sm:text-white">
                    <BookOpenTextIcon size='80' />
                </div>

                <DropdownSettings
                    title='Unit'
                    deleteName={unit?.unitName}
                    userId={user.id}
                    isAuthorized={isAuthorized}
                    documentData={unit} />

                <div className="w-full flex_center flex-col gap-2 px-4 mt-8 sm:mt-0">
                    <div className="flex_center flex-col gap-2 w-full">
                        {!isLoading ?
                            <>
                                <h1 className='text-[1.8em] sm:text-[2em] font-medium drop-shadow'>{unit?.unitName}</h1>
                                <p className='opacity-90 text-center'>{unit?.unitDesc}</p>
                            </>
                            :
                            <>
                                <RectLoader height='45px' className='mt-3 sm:mt-0 max-w-[600px]' />
                                <RectLoader />
                            </>
                        }
                    </div>

                    <span className="w-full h-[2px] bg-slate-400/40"></span>

                    <div className="w-full flex justify-between sm:justify-center items-center gap-2 sm:gap-10 text-[0.9em]">
                        {!isLoading ?
                            <>
                                <span>Documents: {unit.documents?.length || 0}</span>
                            </>
                            :
                            <>
                                <RectLoader />
                                <RectLoader />
                                <RectLoader />
                            </>
                        }
                    </div>

                    <div className="w-full flex justify-end items-center gap-2 text-[0.8em]">
                        <span>Creator : </span>
                        {!isLoading ?
                            <div className="flex_center gap-2">
                                <AvatarImage url={unit.creator?.image} size={25} />
                                <span>{unit.creator?.name}</span>
                            </div>
                            :
                            <div className="w-[150px] flex_center gap-2">
                                <CircleLoader size='25px' />
                                <RectLoader height='20px' />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center py-4">
                <h2 className='text-[1.7em] font-medium'>Documents</h2>
                {user?.isApproved &&
                    <Link href={`./${unit?.unitName?.toLowerCase().replaceAll(" ", "-")}/upload`} className='flex_center gap-2 text-[1em] bg-primary text-white rounded-sm px-2 py-1.5'>
                        <PlusIcon />
                        <span>Upload</span>
                        <span className='hidden sm:block'>Document</span>
                    </Link>
                }
            </div>

            <Table className='mb-6'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-2 sm:px-4 py-2 min-w-max">File Name</TableHead>
                        <TableHead className="px-2 sm:px-4 py-2 w-[85px]">Size</TableHead>
                        <TableHead className='px-2 sm:px-4 py-2 hidden sm:table-cell'>Uploader</TableHead>
                        <TableHead className='px-2 sm:px-4 py-2 sm:table-cell'>Date</TableHead>
                        <TableHead className="px-2 sm:px-4 py-2 w-fit text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {unit?.documents?.map((doc, index) => {
                        // File Size Formating
                        const formatDataSize = (bytes: number): string => {
                            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                            if (bytes === 0) return '0 Byte';

                            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
                            const sizeInUnit = bytes / Math.pow(1024, i);

                            const formattedSize = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(sizeInUnit);
                            return formattedSize + ' ' + sizes[i];
                        };

                        // Date Formating
                        const date = doc?.createdAt && new Date(doc.createdAt);
                        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
                        const formattedDate = date ? new Intl.DateTimeFormat('en-US', options).format(date) : 'Invalid Date';

                        // Check if user is the document uploader
                        const isDocumentUploader = doc?.creatorId === user.id;

                        return (
                            <TableRow key={index}>
                                <TableCell className="px-2 sm:px-4 py-2 font-medium capitalize">{doc?.documentName}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 ">{formatDataSize(parseInt(doc?.size))}</TableCell>
                                <TableCell className='px-2 sm:px-4 py-2 hidden sm:table-cell'>
                                    <div className="flex items-center gap-2">
                                        <AvatarImage url={doc.creator?.image} size={25} />
                                        <span>{doc.creator?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className='px-2 sm:px-4 py-2 sm:table-cell min-w-[70px]'>{formattedDate}</TableCell>
                                <TableCell className="px-2 sm:px-4 py-2 text-right flex_center flex-col sm:flex-row gap-2">
                                    <Button
                                        size='icon'
                                        title='Download'
                                        onClick={() => handleDownload(doc?.link, doc?.documentName)}
                                        className='flex_center bg-primary text-white rounded-md h-10 w-full p-2'>
                                        <DownloadCloudIcon />
                                    </Button>

                                    {(isAuthorized || isDocumentUploader) &&
                                        <Dialog open={open} onOpenChange={setOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant='destructive'
                                                    size='icon'
                                                    title='Delete'
                                                    className='w-full p-2 text-white deleteBtnBg'>
                                                    <Trash2Icon />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className='w-[90%] mx-auto rounded-md'>
                                                <DialogHeader>
                                                    <DialogTitle>Delete <span className='text-red-600'>{doc?.documentName}</span> ?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete the document.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="flex-row gap-12 mt-4">
                                                    <DialogClose asChild>
                                                        <Button variant="secondary" className='flex_center gap-2 w-full'>
                                                            <XIcon size={20} />
                                                            <span>Cancel</span>
                                                        </Button>
                                                    </DialogClose>

                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => deleteFiles(doc?.link, doc?.id)}
                                                        className='flex_center gap-2 w-full text-white deleteBtnBg'>
                                                        <Trash2Icon size={20} />
                                                        <span>Delete</span>
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </section>
    )
}

export default UnitInfo