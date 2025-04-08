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
        }),
        updateCourse: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/courses/${id}`,
                method: "PUT",
                body: formData,
            }),
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE",
            }),
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