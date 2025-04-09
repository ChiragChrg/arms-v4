import { Institute } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type CreateInstitutionType = {
    instituteName: string,
    instituteDesc: string,
    creatorId: string
}

type UpdateInstitutionType = {
    id: string;
    instituteName: string;
    instituteDesc: string;
}

export const institutionAPISlice = createApi({
    reducerPath: "institutionAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/resources/institution" }),
    endpoints: (builder) => ({
        getAllInstitutions: builder.query({
            query: () => "/all",
        }),
        getInstitutionById: builder.query({
            query: (id: string) => ({
                url: "/",
                method: "GET",
                params: { id },
            }),
        }),
        createInstitution: builder.mutation({
            query: (formData: CreateInstitutionType) => ({
                url: "/",
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    institutionAPISlice.util.updateQueryData("getAllInstitutions", undefined, (draft) => {
                        draft.push(arg);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateInstitution: builder.mutation({
            query: (formData: UpdateInstitutionType) => ({
                url: `/`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    institutionAPISlice.util.updateQueryData("getAllInstitutions", undefined, (draft) => {
                        const index = draft.findIndex((institution: Institute) => institution.id === arg.id);
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
        deleteInstitution: builder.mutation({
            query: (id: string) => ({
                url: `/`,
                method: "DELETE",
                params: { id },
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    institutionAPISlice.util.updateQueryData("getAllInstitutions", undefined, (draft) => {
                        const index = draft.findIndex((institution: Institute) => institution.id === id);
                        if (index !== -1) {
                            draft.splice(index, 1);
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
    }),
});

export const {
    useGetAllInstitutionsQuery,
    useGetInstitutionByIdQuery,
    useCreateInstitutionMutation,
    useUpdateInstitutionMutation,
    useDeleteInstitutionMutation,
} = institutionAPISlice;