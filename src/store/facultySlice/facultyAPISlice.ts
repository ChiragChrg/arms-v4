import { User } from '@prisma/client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const facultyAPISlice = createApi({
    reducerPath: 'facultyAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/faculty' }),
    endpoints: (builder) => ({
        getAllFaculty: builder.query({
            query: () => '/all',
        }),
        getFacultyById: builder.query({
            query: (id: string) => `/${id}`,
        }),
        getPendingApproval: builder.query({
            query: () => '/pending-approval',
        }),
        approveFaculty: builder.mutation({
            query: (facultyId) => ({
                url: `/approve`,
                method: 'POST',
                body: { facultyId },
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