import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardAPISlice = createApi({
    reducerPath: 'dashboardAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getDashboardCount: builder.query({
            query: () => '/dashcount',
        }),
    }),
});

export const {
    useGetDashboardCountQuery,
} = dashboardAPISlice;