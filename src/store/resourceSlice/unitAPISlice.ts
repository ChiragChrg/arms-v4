import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS, UnitTypes } from "../types";
import { institutionAPISlice } from "./institutionAPISlice";
import { courseAPISlice } from "./courseAPISlice";
import { subjectAPISlice } from "./subjectAPISlice";

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
    tagTypes: [API_TAGS.UNITS, API_TAGS.UNIT],
    endpoints: (builder) => ({
        getAllUnits: builder.query<UnitTypes[], unknown>({
            query: () => "/all",
            providesTags: (result) =>
                result
                    ? [
                        { type: API_TAGS.UNITS as typeof API_TAGS.UNITS, id: "Unit_List" },
                        ...result.map((unit) => ({ type: API_TAGS.UNIT as typeof API_TAGS.UNIT, id: unit.id })),
                    ]
                    : [{ type: API_TAGS.UNITS as typeof API_TAGS.UNITS, id: "Unit_List" }],
        }),
        getUnitBySlug: builder.query<UnitTypes, unknown>({
            query: (slug: string) => `/${slug}`,
            providesTags: (result) => [
                { type: API_TAGS.UNITS as typeof API_TAGS.UNITS, id: "Unit_List" },
                { type: API_TAGS.UNIT as typeof API_TAGS.UNIT, id: result?.id }
            ]
        }),
        createUnit: builder.mutation({
            query: (formData: CreateUnitType) => ({
                url: '', // Same as '/'
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
                    dispatch(unitAPISlice.util.invalidateTags([API_TAGS.UNITS]));
                } catch {
                    patchResult.undo();
                }
            }
        }),
        updateUnit: builder.mutation({
            query: (formData: UpdateUnitType) => ({
                url: '', // Same as '/'
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
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
                    dispatch(unitAPISlice.util.invalidateTags([API_TAGS.UNITS]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteUnit: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    unitAPISlice.util.updateQueryData("getAllUnits", undefined, (draft) => {
                        return draft.filter((unit: UnitTypes) => unit.id !== id);
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                    dispatch(subjectAPISlice.util.invalidateTags([API_TAGS.SUBJECTS]));
                    dispatch(unitAPISlice.util.invalidateTags([API_TAGS.UNITS]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetAllUnitsQuery,
    useGetUnitBySlugQuery,
    useCreateUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation,
} = unitAPISlice;