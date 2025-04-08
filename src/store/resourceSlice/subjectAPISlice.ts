import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subjectAPISlice = createApi({
    reducerPath: "subjectAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getAllSubjects: builder.query({
            query: () => "/subjects/all",
        }),
        getSubjectById: builder.query({
            query: (id: string) => `/subjects/${id}`,
        }),
        createSubject: builder.mutation({
            query: (formData) => ({
                url: "/subjects",
                method: "POST",
                body: formData,
            })
        }),
        updateSubject: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/subjects/${id}`,
                method: "PUT",
                body: formData,
            })
        }),
        deleteSubject: builder.mutation({
            query: (id) => ({
                url: `/subjects/${id}`,
                method: "DELETE",
            })
        }),
    }),
});

export const {
    useGetAllSubjectsQuery,
    useGetSubjectByIdQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
} = subjectAPISlice;