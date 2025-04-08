import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authAPISlice = createApi({
    reducerPath: 'authAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (formData) => ({
                url: '/register',
                method: 'POST',
                body: formData,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `/reset-password/${token}`,
                method: 'POST',
                body: { password },
            }),
        })
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authAPISlice;