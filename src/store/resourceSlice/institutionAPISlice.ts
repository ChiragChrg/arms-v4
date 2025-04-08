import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AddInstitutionType {
    formData: Record<string, unknown>;
}

interface UpdateInstitutionType {
    id: string;
    formData: Record<string, unknown>;
}

export const institutionAPISlice = createApi({
    reducerPath: "institutionAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getAllInstitutions: builder.query({
            query: () => "/institutions/all",
        }),
        getInstitutionById: builder.query({
            query: (id: string) => `/institutions/${id}`,
        }),
        createInstitution: builder.mutation({
            query: (formData: AddInstitutionType) => ({
                url: "/institutions",
                method: "POST",
                body: formData,
            }),
        }),
        updateInstitution: builder.mutation({
            query: ({ id, formData }: UpdateInstitutionType) => ({
                url: `/institutions/${id}`,
                method: "PUT",
                body: formData,
            }),
        }),
        deleteInstitution: builder.mutation({
            query: (id: string) => ({
                url: `/institutions/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetAllInstitutionsQuery,
    useGetInstitutionByIdQuery,
    useCreateInstitutionMutation,
    useUpdateInstitutionMutation,
    useDeleteInstitutionMutation,
} = institutionAPISlice;