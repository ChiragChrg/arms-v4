import { Subject } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type CreateSubjectType = {
    subjectName: string,
    subjectDesc: string,
    courseId: string,
    creatorId: string
}

type UpdateSubjectType = {
    id: string;
    subjectName: string;
    subjectDesc: string;
}

export const subjectAPISlice = createApi({
    reducerPath: "subjectAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/resources/subject" }),
    endpoints: (builder) => ({
        getAllSubjects: builder.query({
            query: () => "/all",
        }),
        getSubjectById: builder.query({
            query: (id: string) => ({
                url: "/",
                method: "GET",
                params: { id },
            }),
        }),
        createSubject: builder.mutation({
            query: (formData: CreateSubjectType) => ({
                url: "/",
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
            query: (formData: UpdateSubjectType) => ({
                url: `/`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    subjectAPISlice.util.updateQueryData("getAllSubjects", undefined, (draft) => {
                        const index = draft.findIndex((subject: Subject) => subject.id === arg.id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...arg };
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
            query: (id: string) => ({
                url: `/`,
                method: "DELETE",
                params: { id },
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