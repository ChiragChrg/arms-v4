import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authAPISlice = createApi({
    reducerPath: 'authAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
    endpoints: (builder) => ({
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
        }),
    }),
});

export const {
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authAPISlice;