import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
            })
        }),
        updateDocument: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/documents/${id}`,
                method: "PUT",
                body: formData,
            })
        }),
        deleteDocument: builder.mutation({
            query: (id) => ({
                url: `/documents/${id}`,
                method: "DELETE",
            })
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