import { useGetAllCoursesQuery, useGetCourseBySlugQuery } from "@/store";
import { useMemo } from "react";

/**
 * Custom hook to fetch course data by slug.
 * @param slug - The slug of the course to fetch.
 * @return An object containing the course data and loading state.
 */
export const useCourse = (slug: string) => {
    const { data: courseList } = useGetAllCoursesQuery({});

    // Check if the course is already in the cache
    const cachedCourse = useMemo(() => {
        return courseList?.find(course =>
            course.courseName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [courseList, slug]);

    // If the course is not in the cache, fetch it by slug
    const { data: fetchedCourse, isFetching } = useGetCourseBySlugQuery(slug, {
        skip: !!cachedCourse,
    });

    const course = cachedCourse || fetchedCourse;

    return {
        course,
        isLoading: !course && (isFetching || !courseList),
    };
};