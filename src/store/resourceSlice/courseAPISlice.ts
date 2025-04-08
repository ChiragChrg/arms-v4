import { Course } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseAPISlice = createApi({
    reducerPath: "courseAPISlice",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getAllCourses: builder.query({
            query: () => "/courses/all",
        }),
        getCourseById: builder.query({
            query: (id: string) => `/courses/${id}`,
        }),
        createCourse: builder.mutation({
            query: (formData) => ({
                url: "/courses",
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
            query: ({ id, formData }) => ({
                url: `/courses/${id}`,
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async ({ id, formData }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    courseAPISlice.util.updateQueryData("getAllCourses", undefined, (draft) => {
                        const index = draft.findIndex((course: Course) => course.id === id);
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
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE",
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