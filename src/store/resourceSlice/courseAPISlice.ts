import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CourseTypes } from "../types";

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
        getAllCourses: builder.query<CourseTypes[], unknown>({
            query: () => "/all",
        }),
        getCourseById: builder.query<CourseTypes, unknown>({
            query: (id: string) => `/get/${id}`,
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
                        draft.push(arg as CourseTypes);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
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
                        const index = draft.findIndex((course: CourseTypes) => course.id === arg.id);
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