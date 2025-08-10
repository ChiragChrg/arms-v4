import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS, DocumentTypes } from "../types";
import { institutionAPISlice } from "./institutionAPISlice";
import { courseAPISlice } from "./courseAPISlice";
import { subjectAPISlice } from "./subjectAPISlice";
import { unitAPISlice } from "./unitAPISlice";

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
    tagTypes: [API_TAGS.DOCUMENTS, API_TAGS.DOCUMENT],
    endpoints: (builder) => ({
        getAllDocuments: builder.query({
            query: () => "/all",
            providesTags: [API_TAGS.DOCUMENTS],
        }),
        getDocumentById: builder.query({
            query: (id: string) => `/get/${id}`,
            providesTags: (result) => [{ type: API_TAGS.DOCUMENT, id: result?.id }],
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
                    dispatch(unitAPISlice.util.invalidateTags([API_TAGS.UNITS]));
                    dispatch(documentAPISlice.util.invalidateTags([API_TAGS.DOCUMENTS]));
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
                    dispatch(unitAPISlice.util.invalidateTags([API_TAGS.UNITS]));
                    dispatch(documentAPISlice.util.invalidateTags([API_TAGS.DOCUMENTS]));
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
                    dispatch(unitAPISlice.util.invalidateTags([API_TAGS.UNITS]));
                    dispatch(documentAPISlice.util.invalidateTags([API_TAGS.DOCUMENTS]));
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