import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserTypes } from '../types';

type ApproveFacultyType = {
    facultyId: string;
    approval: "approve" | "reject";
};

export const facultyAPISlice = createApi({
    reducerPath: 'facultyAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/faculty' }),
    endpoints: (builder) => ({
        getAllFaculty: builder.query<UserTypes[], unknown>({
            query: () => '/all',
        }),
        getFacultyById: builder.query<UserTypes, string>({
            query: (id: string) => `/${id}`,
        }),
        approveFaculty: builder.mutation({
            query: (formData: ApproveFacultyType) => ({
                url: `/approve`,
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
                } catch {
                    patchResult.undo();
                }
            }
        }),
    }),
});

export const {
    useGetAllFacultyQuery,
    useGetFacultyByIdQuery,
    useApproveFacultyMutation,
    useDeleteFacultyMutation,
} = facultyAPISlice;