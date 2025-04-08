import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const facultyAPISlice = createApi({
    reducerPath: 'facultyAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getFaculty: builder.query({
            query: () => '/faculty',
        }),
        getPendingApproval: builder.query({
            query: () => '/faculty/pending-approval',
        }),
        approveFaculty: builder.mutation({
            query: (facultyId) => ({
                url: `/faculty/approve/${facultyId}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetFacultyQuery,
    useApproveFacultyMutation
} = facultyAPISlice;