import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DocumentTypes } from "../types";

type UploadDocumentType = {
    documentName: string;
    type: string;
    size: string;
    link: string;
}

type CreateDocumentType = {
    documentData: UploadDocumentType[];
    unitId: string;
    creatorId: string;
};

type UpdateDocumentType = {
    id: string;
    documentName: string;
    documentDesc: string;
};

export const documentAPISlice = createApi({
    reducerPath: "documentAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/resources/document" }),
    endpoints: (builder) => ({
        getAllDocuments: builder.query({
            query: () => "/all",
        }),
        getDocumentById: builder.query({
            query: (id: string) => `/get/${id}`,
        }),
        createDocument: builder.mutation({
            query: (formData: CreateDocumentType) => ({
                url: '', // Same as '/'
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    documentAPISlice.util.updateQueryData("getAllDocuments", undefined, (draft) => {
                        draft.push(formData);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),
        updateDocument: builder.mutation({
            query: (formData: UpdateDocumentType) => ({
                url: '', // Same as '/'
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    documentAPISlice.util.updateQueryData("getAllDocuments", undefined, (draft) => {
                        const index = draft.findIndex((document: DocumentTypes) => document.id === formData.id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...formData };
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteDocument: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    documentAPISlice.util.updateQueryData("getAllDocuments", undefined, (draft) => {
                        return draft.filter((document: DocumentTypes) => document.id !== id);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetAllDocumentsQuery,
    useGetDocumentByIdQuery,
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
} = documentAPISlice;