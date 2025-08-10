import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type RegisterUserType = {
    name: string,
    email: string,
    password: string,
}

type ResetPasswordType = {
    id: string,
    password: string
}

export const authAPISlice = createApi({
    reducerPath: 'authAPISlice',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (formData: RegisterUserType) => ({
                url: '/register',
                method: 'POST',
                body: formData,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email: string) => ({
                url: '/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ id, password }: ResetPasswordType) => ({
                url: `/reset-password`,
                method: 'POST',
                body: { id, password },
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authAPISlice;