import { useGetAllInstitutionsQuery, useGetInstitutionBySlugQuery } from "@/store";
import { InstitutionTypes } from "@/store/types";
import { useMemo } from "react";

type Params = {
    preferCache?: boolean;
};

/**
 * Custom hook to fetch institution data by slug.
 * @param slug - The slug of the institution to fetch.
 * @param preferCache - Whether to prefer cached data or not.
 * @return An object containing the institution data and loading state.
 */
export const useInstitution = (slug: string, params: Params = {}) => {
    const { preferCache = false } = params;
    const { data: institutionList, isLoading: isListLoading } = useGetAllInstitutionsQuery(undefined, { skip: !preferCache });

    // Check if the institution is already in the cache
    const cachedInstitute = useMemo(() => {
        if (!institutionList) return undefined;

        return institutionList.find(inst =>
            inst.instituteName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [institutionList, slug]);

    // Determine if we should skip the slug query
    const shouldSkipSlugQuery = preferCache && (isListLoading || !!cachedInstitute);

    // If the institution is not in the cache, fetch it by slug
    const { data: fetchedInstitute, isFetching, isLoading } = useGetInstitutionBySlugQuery(slug, {
        skip: shouldSkipSlugQuery
    });

    const institute = (cachedInstitute || fetchedInstitute) as InstitutionTypes;

    return {
        institute,
        isLoading: !institute && (isListLoading || isFetching || isLoading),
    };
};
