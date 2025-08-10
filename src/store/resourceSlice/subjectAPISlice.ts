import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS, SubjectTypes } from "../types";
import { institutionAPISlice } from "./institutionAPISlice";
import { courseAPISlice } from "./courseAPISlice";

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
    tagTypes: [API_TAGS.SUBJECTS, API_TAGS.SUBJECT],
    endpoints: (builder) => ({
        getAllSubjects: builder.query<SubjectTypes[], unknown>({
            query: () => "/all",
            providesTags: [API_TAGS.SUBJECTS],
        }),
        getSubjectBySlug: builder.query<SubjectTypes, unknown>({
            query: (slug: string) => `/${slug}`,
            providesTags: (result) => [{ type: API_TAGS.SUBJECT, id: result?.id }],
        }),
        createSubject: builder.mutation({
            query: (formData: CreateSubjectType) => ({
                url: '', // Same as '/'
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
                }
                catch {
                    patchResult.undo();
                }
            },
        }),
        updateSubject: builder.mutation({
            query: (formData: UpdateSubjectType) => ({
                url: '', // Same as '/'
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
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
    useGetSubjectBySlugQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
} = subjectAPISlice;