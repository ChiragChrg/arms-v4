import { Subject } from "@prisma/client";
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
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    subjectAPISlice.util.updateQueryData("getAllSubjects", undefined, (draft) => {
                        draft.push(arg);
                    })
                );
                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            },
        }),
        updateSubject: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/subjects/${id}`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async ({ id, formData }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    subjectAPISlice.util.updateQueryData("getAllSubjects", undefined, (draft) => {
                        const index = draft.findIndex((subject: Subject) => subject.id === id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...formData };
                        }
                    })
                );
                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            },
        }),
        deleteSubject: builder.mutation({
            query: (id) => ({
                url: `/subjects/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    subjectAPISlice.util.updateQueryData("getAllSubjects", undefined, (draft) => {
                        return draft.filter((subject: Subject) => subject.id !== id);
                    })
                );
                try {
                    await queryFulfilled;
                }
                catch {
                    patchResult.undo();
                }
            },
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