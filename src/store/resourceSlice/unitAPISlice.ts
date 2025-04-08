import { Unit } from "@prisma/client";
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
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    unitAPISlice.util.updateQueryData("getAllUnits", undefined, (draft) => {
                        draft.push(arg);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),
        updateUnit: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/units/${id}`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async ({ id, formData }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    unitAPISlice.util.updateQueryData("getAllUnits", undefined, (draft) => {
                        const index = draft.findIndex((unit: Unit) => unit.id === id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...formData };
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
        deleteUnit: builder.mutation({
            query: (id) => ({
                url: `/units/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    unitAPISlice.util.updateQueryData("getAllUnits", undefined, (draft) => {
                        return draft.filter((unit: Unit) => unit.id !== id);
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
    useGetAllUnitsQuery,
    useGetUnitByIdQuery,
    useCreateUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation,
} = unitAPISlice;