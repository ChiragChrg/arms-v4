import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const unitAPISlice = createApi({
    reducerPath: "unitAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getAllUnits: builder.query({
            query: () => "/units/all",
        }),
        getUnitById: builder.query({
            query: (id: string) => `/units/${id}`,
        }),
        createUnit: builder.mutation({
            query: (formData) => ({
                url: "/units",
                method: "POST",
                body: formData,
            })
        }),
        updateUnit: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/units/${id}`,
                method: "PUT",
                body: formData,
            })
        }),
        deleteUnit: builder.mutation({
            query: (id) => ({
                url: `/units/${id}`,
                method: "DELETE",
            })
        }),
    }),
});

export const {
    useGetAllUnitsQuery,
    useGetUnitByIdQuery,
    useCreateUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation,
} = unitAPISlice;