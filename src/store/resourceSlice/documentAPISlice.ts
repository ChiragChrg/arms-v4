import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Document } from "@prisma/client";

type CreateDocumentType = {
    documentName: string;
    documentDesc: string;
    type: string;
    size: string;
    link: string;
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
            query: (id: string) => ({
                url: "/",
                method: "GET",
                params: { id },
            }),
        }),
        createDocument: builder.mutation({
            query: (formData: CreateDocumentType) => ({
                url: "/",
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
                url: `/`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    documentAPISlice.util.updateQueryData("getAllDocuments", undefined, (draft) => {
                        const index = draft.findIndex((document: Document) => document.id === formData.id);
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
                url: `/`,
                method: "DELETE",
                params: { id },
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    documentAPISlice.util.updateQueryData("getAllDocuments", undefined, (draft) => {
                        return draft.filter((document: Document) => document.id !== id);
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