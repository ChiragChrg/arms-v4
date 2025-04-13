import { useGetAllSubjectsQuery, useGetSubjectBySlugQuery } from "@/store";
import { useMemo } from "react";

/**
 * Custom hook to fetch subject data by slug.
 * @param slug - The slug of the subject to fetch.
 * @return An object containing the subject data and loading state.
 */
export const useSubject = (slug: string) => {
    const { data: subjectList } = useGetAllSubjectsQuery({});

    // Check if the subject is already in the cache
    const cachedSubject = useMemo(() => {
        return subjectList?.find(subj =>
            subj.subjectName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [subjectList, slug]);

    // If the subject is not in the cache, fetch it by slug
    const { data: fetchedSubject, isFetching } = useGetSubjectBySlugQuery(slug, {
        skip: !!cachedSubject,
    });

    const subject = cachedSubject || fetchedSubject;

    return {
        subject,
        isLoading: !subject && (isFetching || !subjectList),
    };
}