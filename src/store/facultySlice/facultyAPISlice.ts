import { User } from '@prisma/client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const facultyAPISlice = createApi({
    reducerPath: 'facultyAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getAllFaculty: builder.query({
            query: () => '/faculty/all',
        }),
        getFacultyById: builder.query({
            query: (id: string) => `/faculty/${id}`,
        }),
        getPendingApproval: builder.query({
            query: () => '/faculty/pending-approval',
        }),
        approveFaculty: builder.mutation({
            query: (facultyId) => ({
                url: `/faculty/approve/${facultyId}`,
                method: 'POST',
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    facultyAPISlice.util.updateQueryData('getPendingApproval', undefined, (draft) => {
                        const index = draft.findIndex((faculty: User) => faculty.id === arg);
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
            },
        }),
    }),
});

export const {
    useGetAllFacultyQuery,
    useGetFacultyByIdQuery,
    useGetPendingApprovalQuery,
    useApproveFacultyMutation
} = facultyAPISlice;