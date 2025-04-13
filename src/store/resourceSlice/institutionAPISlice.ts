import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS, InstitutionTypes } from "../types";

type CreateInstitutionType = {
    instituteName: string,
    description: string,
    creatorId: string,

    // Optional properties for the API request to match the InstitutionTypes interface
    id?: never;
    createdAt?: never;
    courses?: never[];
    creator?: never;
}

type UpdateInstitutionType = {
    id: string;
    instituteName: string;
    description: string;
}

export const institutionAPISlice = createApi({
    reducerPath: "institutionAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/resources/institution" }),
    tagTypes: [API_TAGS.INSTITUTIONS, API_TAGS.INSTITUTION],
    endpoints: (builder) => ({
        getAllInstitutions: builder.query<InstitutionTypes[], unknown>({
            query: () => "/all",
            providesTags: [API_TAGS.INSTITUTIONS],
        }),
        getInstitutionById: builder.query<InstitutionTypes, unknown>({
            query: (id: string) => `/${id}`,
            providesTags: (result) => [{ type: API_TAGS.INSTITUTION, id: result?.id }],
        }),
        createInstitution: builder.mutation({
            query: (formData: CreateInstitutionType) => ({
                url: '', // Same as '/'
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    institutionAPISlice.util.updateQueryData("getAllInstitutions", undefined, (draft) => {
                        draft.push({
                            ...arg,
                            id: "temp-id-" + Date.now(),
                            createdAt: new Date(),
                            courses: [],
                            creator: undefined,
                        });
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateInstitution: builder.mutation({
            query: (formData: UpdateInstitutionType) => ({
                url: '', // Same as '/'
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    institutionAPISlice.util.updateQueryData("getAllInstitutions", undefined, (draft) => {
                        const index = draft.findIndex((institution: InstitutionTypes) => institution.id === arg.id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...arg };
                        }
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTION]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteInstitution: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    institutionAPISlice.util.updateQueryData("getAllInstitutions", undefined, (draft) => {
                        const index = draft.findIndex((institution: InstitutionTypes) => institution.id === id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                } catch {
                    patchResult.undo();
                }
            },
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