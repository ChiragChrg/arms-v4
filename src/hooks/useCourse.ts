import { useGetAllCoursesQuery, useGetCourseBySlugQuery } from "@/store";
import { CourseTypes } from "@/store/types";
import { useMemo } from "react";

type Params = {
    preferCache?: boolean;
};

/**
 * Custom hook to fetch course data by slug.
 * @param slug - The slug of the course to fetch.
 * @param preferCache - Whether to prefer cached data or not.
 * @return An object containing the course data and loading state.
 */
export const useCourse = (slug: string, params: Params = {}) => {
    const { preferCache = false } = params;
    const { data: courseList, isLoading: isListLoading } = useGetAllCoursesQuery(undefined, { skip: !preferCache });

    // Check if the course is already in the cache
    const cachedCourse = useMemo(() => {
        if (!courseList) return undefined;

        return courseList?.find(course =>
            course.courseName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [courseList, slug]);

    // Determine if we should skip the slug query
    const shouldSkipSlugQuery = preferCache && (isListLoading || !!cachedCourse);

    // If the course is not in the cache, fetch it by slug
    const { data: fetchedCourse, isFetching, isLoading } = useGetCourseBySlugQuery(slug, {
        skip: shouldSkipSlugQuery
    });

    const course = (cachedCourse || fetchedCourse) as CourseTypes;

    return {
        course,
        isLoading: !course && (isListLoading || isFetching || isLoading),
    };
};