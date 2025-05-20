import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_TAGS, UserTypes } from '../types';

type ApproveFacultyType = {
    facultyId: string;
    approval: "approve" | "reject";
};

export const facultyAPISlice = createApi({
    reducerPath: 'facultyAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/faculty' }),
    tagTypes: [API_TAGS.FACULTIES, API_TAGS.FACULTY],
    endpoints: (builder) => ({
        getAllFaculty: builder.query<UserTypes[], unknown>({
            query: () => '/all',
            providesTags: [API_TAGS.FACULTIES],
        }),
        getFacultyRequest: builder.query<UserTypes[], unknown>({
            query: () => '/request',
            providesTags: [API_TAGS.FACULTIES],
        }),
        getFacultyById: builder.query<UserTypes, string>({
            query: (id: string) => `/${id}`,
            providesTags: (result) => [{ type: API_TAGS.FACULTY, id: result?.id }],
        }),
        approveFaculty: builder.mutation({
            query: (formData: ApproveFacultyType) => ({
                url: ``,
                method: 'POST',
                body: formData,
            }),
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    facultyAPISlice.util.updateQueryData('getAllFaculty', undefined, (draft) => {
                        const index = draft.findIndex((faculty: UserTypes) => faculty.id === formData.facultyId);
                        if (index !== -1) {
                            draft[index].isApproved = formData.approval === "approve";
                        }
                    })
                );

                try {
                    await queryFulfilled;
                    dispatch(facultyAPISlice.util.invalidateTags([API_TAGS.FACULTIES]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteFaculty: builder.mutation({
            query: (facultyId) => ({
                url: `/${facultyId}`,
                method: 'DELETE',
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    facultyAPISlice.util.updateQueryData('getAllFaculty', undefined, (draft) => {
                        const index = draft.findIndex((faculty: UserTypes) => faculty.id === arg);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(facultyAPISlice.util.invalidateTags([API_TAGS.FACULTIES]));
                } catch {
                    patchResult.undo();
                }
            }
        }),
    }),
});

export const {
    useGetAllFacultyQuery,
    useGetFacultyRequestQuery,
    useGetFacultyByIdQuery,
    useApproveFacultyMutation,
    useDeleteFacultyMutation,
} = facultyAPISlice;