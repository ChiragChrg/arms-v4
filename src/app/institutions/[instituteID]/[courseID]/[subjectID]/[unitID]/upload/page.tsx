"use client";

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useEdgeStore } from '@/lib/edgestore';
import { useSelector } from 'react-redux';
import { SEL_User, useCreateDocumentMutation, useGetUnitBySlugQuery } from '@/store';

import { MultiFileDropzone, type FileState } from './FileDropZone'
import NavRoute from '@/components/NavRoutes'
import MobileHeader from '@/components/MobileHeader'

import OpenBookSVG from '@/assets/Icons/OpenBookSVG'
import BuildingSVG from '@/assets/Icons/BuildingSVG'
import BookStackSVG from '@/assets/Icons/BookStackSVG'
import { BookOpenTextIcon } from 'lucide-react'
import toast from 'react-hot-toast';

type Params = {
    instituteID: string,
    courseID: string,
    subjectID: string,
    unitID: string
}

type FileUploadRes = {
    documentName: string;
    documentDesc: string;
    type: string;
    size: string;
    link: string;
}

const UploadDocuments = () => {
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const [isUploadComplete, setIsUploadComplete] = useState<boolean>(false);

    const params = useParams<Params>()
    const { edgestore } = useEdgeStore();

    // Get User Data
    const { user } = useSelector(SEL_User);
    const { data: unit } = useGetUnitBySlugQuery(params?.unitID.replaceAll("-", " "));

    // Create Documents Mutation Handler
    const [createDocuments] = useCreateDocumentMutation();

    /**
     * Function to update the progress of a file upload
     * @param key - The unique key of the file
     * @param progress - The current progress of the file upload
     */
    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
            const newFileStates = structuredClone(fileStates);
            const fileState = newFileStates.find(
                (fileState) => fileState.key === key,
            );
            if (fileState) {
                fileState.progress = progress;
            }
            return newFileStates;
        });
    }

    // Uploading File
    const uploadFiles = async () => {
        if (!user.id || !unit) return

        // File Upload Meta Data
        const uploadMeta: FileUploadRes[] = []

        // Uploading Files to Edgestore
        await Promise.all(
            fileStates.map(async (fileState) => {
                try {
                    if (fileState.progress !== 'PENDING') return;

                    const res = await edgestore.publicFiles.upload({
                        file: fileState.file,
                        onProgressChange: async (progress) => {
                            updateFileProgress(fileState.key, progress);
                            if (progress === 100) {
                                // wait 1 second to set it to complete
                                await new Promise((resolve) => setTimeout(resolve, 1000));
                                updateFileProgress(fileState.key, 'COMPLETE');
                            }
                        },
                    });

                    // Adding file info to uploadMeta
                    uploadMeta.push({
                        documentName: fileState.file.name,
                        documentDesc: "",
                        type: fileState.file.type,
                        size: `${(res.size / 1024).toFixed(2)} KB`,
                        link: res.url,
                    })
                } catch (err) {
                    updateFileProgress(fileState.key, 'ERROR');
                    toast.error("Error while uploading files");
                    console.error(err);
                }
            }),
        );

        // Upload Documents info to Database
        try {
            await createDocuments({
                documentData: uploadMeta,
                unitId: unit.id,
                creatorId: user.id
            }).unwrap();

            setIsUploadComplete(true)
            toast.success("Files uploaded successfully!")
        } catch (error) {
            setIsUploadComplete(true)
            console.error(error)
            toast.error("Failed to update Database")
        }
    }


    return (
        <section className='section_style'>
            <NavRoute routes={[
                "Institutions",
                `Institutions/${params?.instituteID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}/${params?.unitID}`,
                `Institutions/${params?.instituteID}/${params?.courseID}/${params?.subjectID}/${params?.unitID}/Create`
            ]} />
            <MobileHeader />

            <h1 className="text-[1.8em] sm:text-[2em] 2xl:text-[3em] font-medium my-2 text-center">
                Upload new <span className="text-primary">Documents</span>
            </h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 2xl:gap-4 w-full sm:px-8 mt-6'>
                <label className="relative w-full">
                    <span className='text-[0.9em] bg-background/0 px-1'>Institution</span>

                    <div className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                        <input
                            type="text"
                            required={true}
                            defaultValue={params?.instituteID?.replaceAll("-", " ") || ""}
                            disabled={true}
                            className='text-[1em] w-full bg-background/0 text-slate-400 px-2 capitalize py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                        <BuildingSVG size="24" className="absolute right-2 text-slate-400" />
                    </div>
                </label>
                <label className="relative w-full">
                    <span className='text-[0.9em] bg-background/0 px-1'>Course</span>

                    <div className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                        <input
                            type="text"
                            required={true}
                            defaultValue={params?.courseID?.replaceAll("-", " ") || ""}
                            disabled={true}
                            className='text-[1em] w-full bg-background/0 text-slate-400 px-2 capitalize py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                        <BookStackSVG size="24" className="absolute right-2 text-slate-400" />
                    </div>
                </label>
                <label className="relative w-full">
                    <span className='text-[0.9em] bg-background/0 px-1'>Subject</span>

                    <div className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                        <input
                            type="text"
                            required={true}
                            defaultValue={params?.subjectID?.replaceAll("-", " ") || ""}
                            disabled={true}
                            className='text-[1em] w-full bg-background/0 text-slate-400 px-2 capitalize py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                        <OpenBookSVG size="24" className="absolute right-2 text-slate-400" />
                    </div>
                </label>
                <label className="relative w-full">
                    <span className='text-[0.9em] bg-background/0 px-1'>Unit</span>

                    <div className="flex items-center border border-muted-foreground sm:focus-within:border-primary rounded p-1">
                        <input
                            type="text"
                            required={true}
                            defaultValue={params?.unitID?.replaceAll("-", " ") || ""}
                            disabled={true}
                            className='text-[1em] w-full bg-background/0 text-slate-400 px-2 capitalize py-1 border-none outline-none placeholder:text-secondary-foreground/70' />

                        <BookOpenTextIcon size={24} className="absolute right-2 text-slate-400" />
                    </div>
                </label>
            </div>

            <div className="w-full h-[2px] bg-input mt-4"></div>

            <MultiFileDropzone
                className='w-full h-[380px] mt-10'
                value={fileStates}
                onChange={(files) => {
                    setFileStates(files);
                }}
                onFilesAdded={async (addedFiles) => {
                    setFileStates([...fileStates, ...addedFiles]);
                }}
                setFileStates={setFileStates} //to reset the state
                uploadFiles={uploadFiles}
                isUploadComplete={isUploadComplete}
                setIsUploadComplete={setIsUploadComplete}
                dropzoneOptions={{
                    maxFiles: 10,
                    maxSize: 26214400
                }}
            />
        </section>
    )
}

export default UploadDocuments