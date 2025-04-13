import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type DashboardCount = {
    institutes: number;
    courses: number;
    subjects: number;
    documents: number;
};

export const dashboardAPISlice = createApi({
    reducerPath: 'dashboardAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/dashboard' }),
    endpoints: (builder) => ({
        getDashboardCount: builder.query<DashboardCount, unknown>({
            query: () => '/dashcount',
        }),
    }),
});

export const {
    useGetDashboardCountQuery,
} = dashboardAPISlice;