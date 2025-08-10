import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS, CourseTypes } from "../types";
import { institutionAPISlice } from "./institutionAPISlice";

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
    tagTypes: [API_TAGS.COURSES, API_TAGS.COURSE],
    endpoints: (builder) => ({
        getAllCourses: builder.query<CourseTypes[], unknown>({
            query: () => "/all",
            providesTags: [API_TAGS.COURSES],
        }),
        getCourseBySlug: builder.query<CourseTypes, unknown>({
            query: (slug: string) => `/${slug}`,
            providesTags: (result) => [{ type: API_TAGS.COURSE, id: result?.id }],
        }),
        createCourse: builder.mutation({
            query: (formData: CreateCourseType) => ({
                url: '', // Same as '/'
                method: "POST",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    courseAPISlice.util.updateQueryData("getAllCourses", undefined, (draft) => {
                        draft.push(arg as CourseTypes);
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateCourse: builder.mutation({
            query: (formData: UpdateCourseType) => ({
                url: '', // Same as '/'
                method: "PUT",
                body: formData,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    courseAPISlice.util.updateQueryData("getAllCourses", undefined, (draft) => {
                        const index = draft.findIndex((course: CourseTypes) => course.id === arg.id);
                        if (index !== -1) {
                            draft[index] = { ...draft[index], ...arg };
                        }
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSE]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteCourse: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    courseAPISlice.util.updateQueryData("getAllCourses", undefined, (draft) => {
                        return draft.filter((course: CourseTypes) => course.id !== id);
                    })
                );
                try {
                    await queryFulfilled;
                    dispatch(institutionAPISlice.util.invalidateTags([API_TAGS.INSTITUTIONS]));
                    dispatch(courseAPISlice.util.invalidateTags([API_TAGS.COURSES]));
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useGetAllCoursesQuery,
    useGetCourseBySlugQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = courseAPISlice;