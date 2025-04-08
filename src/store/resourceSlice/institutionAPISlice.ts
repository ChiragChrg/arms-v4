import { Institute } from "@prisma/client";
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
            query: ({ id, formData }: UpdateInstitutionType) => ({
                url: `/institutions/${id}`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async ({ id, formData }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    institutionAPISlice.util.updateQueryData("getAllInstitutions", undefined, (draft) => {
                        const index = draft.findIndex((institution: Institute) => institution.id === id);
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
        deleteInstitution: builder.mutation({
            query: (id: string) => ({
                url: `/institutions/${id}`,
                method: "DELETE",
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