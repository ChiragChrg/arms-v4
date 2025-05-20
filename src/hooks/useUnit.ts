import { useGetAllUnitsQuery, useGetUnitBySlugQuery } from "@/store";
import { UnitTypes } from "@/store/types";
import { useMemo } from "react";

type Params = {
    preferCache?: boolean;
};

/**
 * Custom hook to fetch unit data by slug.
 * @param slug - The slug of the unit to fetch.
 * @param preferCache - Whether to prefer cached data or not.
 * @return An object containing the unit data and loading state.
 */
export const useUnit = (slug: string, params: Params = {}) => {
    const { preferCache = false } = params;
    const { data: unitList, isLoading: isListLoading } = useGetAllUnitsQuery(undefined, {
        skip: !preferCache,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: true,
    });

    // Check if the unit is already in the cache
    const cachedUnit = useMemo(() => {
        if (!unitList) return undefined;

        return unitList?.find(unit =>
            unit.unitName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [unitList, slug]);

    // Determine if we should skip the slug query
    const shouldSkipSlugQuery = preferCache && (isListLoading || !!cachedUnit);

    // If the unit is not in the cache, fetch it by slug
    const { data: fetchedUnit, isFetching, isLoading } = useGetUnitBySlugQuery(slug, {
        skip: shouldSkipSlugQuery,
        refetchOnMountOrArgChange: true,
    });

    const unit = (cachedUnit || fetchedUnit) as UnitTypes;

    return {
        unit,
        isLoading: !unit && (isListLoading || isFetching || isLoading),
    };
}