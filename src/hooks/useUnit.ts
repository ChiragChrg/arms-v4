import { useGetAllUnitsQuery, useGetUnitBySlugQuery } from "@/store";
import { useMemo } from "react";

/**
 * Custom hook to fetch unit data by slug.
 * @param slug - The slug of the unit to fetch.
 * @return An object containing the unit data and loading state.
 */
export const useUnit = (slug: string) => {
    const { data: unitList } = useGetAllUnitsQuery({});

    // Check if the unit is already in the cache
    const cachedUnit = useMemo(() => {
        return unitList?.find(unit =>
            unit.unitName?.toLowerCase().replaceAll(" ", "-") === slug
        );
    }, [unitList, slug]);

    // If the unit is not in the cache, fetch it by slug
    const { data: fetchedUnit, isFetching } = useGetUnitBySlugQuery(slug, {
        skip: !!cachedUnit,
    });

    const unit = cachedUnit || fetchedUnit;

    return {
        unit,
        isLoading: !unit && (isFetching || !unitList),
    };
}