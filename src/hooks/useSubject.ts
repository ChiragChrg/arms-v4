import { useGetAllSubjectsQuery, useGetSubjectBySlugQuery } from "@/store";
import { SubjectTypes } from "@/store/types";
import { useMemo } from "react";

type Params = {
    preferCache?: boolean;
};


/**
 * Custom hook to fetch subject data by slug.
 * @param slug - The slug of the subject to fetch.
 * @param preferCache - Whether to prefer cached data or not.
 * @return An object containing the subject data and loading state.
 */
export const useSubject = (slug: string, params: Params = {}) => {
    const { preferCache = false } = params;
    const { data: subjectList, isLoading: isListLoading } = useGetAllSubjectsQuery(undefined, { skip: !preferCache });

    // Check if the subject is already in the cache
    const cachedSubject = useMemo(() => {
        if (!subjectList) return undefined;

        return subjectList?.find(subj =>
            subj.subjectName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [subjectList, slug]);

    // Determine if we should skip the slug query
    const shouldSkipSlugQuery = preferCache && (isListLoading || !!cachedSubject);

    // If the subject is not in the cache, fetch it by slug
    const { data: fetchedSubject, isFetching, isLoading } = useGetSubjectBySlugQuery(slug, {
        skip: shouldSkipSlugQuery
    });

    const subject = (cachedSubject || fetchedSubject) as SubjectTypes;

    return {
        subject,
        isLoading: !subject && (isListLoading || isFetching || isLoading),
    };
}