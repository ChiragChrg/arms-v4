import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SubjectTypes } from "../types";

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
        getAllSubjects: builder.query<SubjectTypes[], unknown>({
            query: () => "/all",
        }),
        getSubjectById: builder.query<SubjectTypes, unknown>({
            query: (id: string) => `/${id}`,
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
                        draft.push(arg as SubjectTypes);
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
                        const index = draft.findIndex((subject: SubjectTypes) => subject.id === arg.id);
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
                url: `/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    subjectAPISlice.util.updateQueryData("getAllSubjects", undefined, (draft) => {
                        return draft.filter((subject: SubjectTypes) => subject.id !== id);
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