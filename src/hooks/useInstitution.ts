import { useGetAllInstitutionsQuery, useGetInstitutionBySlugQuery } from "@/store";
import { useMemo } from "react";

/**
 * Custom hook to fetch institution data by slug.
 * @param slug - The slug of the institution to fetch.
 * @return An object containing the institution data and loading state.
 */
export const useInstitution = (slug: string) => {
    const { data: institutionList } = useGetAllInstitutionsQuery({});

    // Check if the institution is already in the cache
    const cachedInstitute = useMemo(() => {
        return institutionList?.find(inst =>
            inst.instituteName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [institutionList, slug]);

    // If the institution is not in the cache, fetch it by slug
    const { data: fetchedInstitute, isFetching } = useGetInstitutionBySlugQuery(slug, {
        skip: !!cachedInstitute,
    });

    const institute = cachedInstitute || fetchedInstitute;

    return {
        institute,
        isLoading: !institute && (isFetching || !institutionList),
    };
};
