import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UnitDoc } from "@prisma/client";

export const documentAPISlice = createApi({
    reducerPath: "documentAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getAllDocuments: builder.query({
            query: () => "/documents/all",
        }),
        getDocumentById: builder.query({
            query: (id: string) => `/documents/${id}`,
        }),
        getDocumentByUnitId: builder.query({
            query: (unitId: string) => `/documents/unit/${unitId}`,
        }),
        getDocumentBySubjectId: builder.query({
            query: (subjectId: string) => `/documents/subject/${subjectId}`,
        }),
        getDocumentByCourseId: builder.query({
            query: (courseId: string) => `/documents/course/${courseId}`,
        }),
        getDocumentByInstitutionId: builder.query({
            query: (institutionId: string) => `/documents/institution/${institutionId}`,
        }),
        getDocumentByFacultyId: builder.query({
            query: (facultyId: string) => `/documents/faculty/${facultyId}`,
        }),
        createDocument: builder.mutation({
            query: (formData) => ({
                url: "/documents",
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
            query: ({ id, formData }) => ({
                url: `/documents/${id}`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async ({ id, formData }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    documentAPISlice.util.updateQueryData("getAllDocuments", undefined, (draft) => {
                        const index = draft.findIndex((document: UnitDoc) => document.id === id);
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
            query: (id) => ({
                url: `/documents/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    documentAPISlice.util.updateQueryData("getAllDocuments", undefined, (draft) => {
                        return draft.filter((document: UnitDoc) => document.id !== id);
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
    useGetDocumentByUnitIdQuery,
    useGetDocumentBySubjectIdQuery,
    useGetDocumentByCourseIdQuery,
    useGetDocumentByInstitutionIdQuery,
    useGetDocumentByFacultyIdQuery,
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation,
} = documentAPISlice;