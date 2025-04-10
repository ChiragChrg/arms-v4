import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UnitTypes } from "../types";

type CreateUnitType = {
    unitName: string,
    unitDesc: string,
    subjectId: string,
    creatorId: string
}

type UpdateUnitType = {
    id: string;
    unitName: string;
    unitDesc: string;
}

export const unitAPISlice = createApi({
    reducerPath: "unitAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/resources/unit" }),
    endpoints: (builder) => ({
        getAllUnits: builder.query<UnitTypes[], unknown>({
            query: () => "/all",
        }),
        getUnitById: builder.query<UnitTypes, unknown>({
            query: (id: string) => ({
                url: "/",
                method: "GET",
                params: { id },
            }),
        }),
        createUnit: builder.mutation({
            query: (formData: CreateUnitType) => ({
                url: "/",
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    unitAPISlice.util.updateQueryData("getAllUnits", undefined, (draft) => {
                        draft.push(arg as UnitTypes);
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
            query: (formData: UpdateUnitType) => ({
                url: `/`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    unitAPISlice.util.updateQueryData("getAllUnits", undefined, (draft) => {
                        const index = draft.findIndex((unit: UnitTypes) => unit.id === arg.id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...arg };
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
            query: (id: string) => ({
                url: `/`,
                method: "DELETE",
                params: { id },
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    unitAPISlice.util.updateQueryData("getAllUnits", undefined, (draft) => {
                        return draft.filter((unit: UnitTypes) => unit.id !== id);
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