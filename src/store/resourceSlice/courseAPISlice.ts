import { Course } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type CreateCourseType = {
    courseName: string,
    courseDesc: string,
    instituteId: string,
    creatorId: string
}

type UpdateCourseType = {
    id: string;
    courseName: string;
    courseDesc: string;
}

export const courseAPISlice = createApi({
    reducerPath: "courseAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/resources/course" }),
    endpoints: (builder) => ({
        getAllCourses: builder.query({
            query: () => "/all",
        }),
        getCourseById: builder.query({
            query: (id: string) => ({
                url: "/",
                method: "GET",
                params: { id },
            }),
        }),
        createCourse: builder.mutation({
            query: (formData: CreateCourseType) => ({
                url: "/",
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    courseAPISlice.util.updateQueryData("getAllCourses", undefined, (draft) => {
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
        updateCourse: builder.mutation({
            query: (formData: UpdateCourseType) => ({
                url: `/`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    courseAPISlice.util.updateQueryData("getAllCourses", undefined, (draft) => {
                        const index = draft.findIndex((course: Course) => course.id === arg.id);
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
        deleteCourse: builder.mutation({
            query: (id: string) => ({
                url: `/`,
                method: "DELETE",
                params: { id },
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    courseAPISlice.util.updateQueryData("getAllCourses", undefined, (draft) => {
                        return draft.filter((course: Course) => course.id !== id);
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
    useGetAllCoursesQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = courseAPISlice;