import { fetchCat, fetchCatUnfiltered } from "@/lib/actions";
import { CatProps } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export const useInfiniteCat = () => {
    return useInfiniteQuery<CatProps[], Error>({
        queryKey: ['cats'],
        initialPageParam: 0,
        queryFn: fetchCat,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length : undefined;
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
};

export const useCat = () => {
    return useQuery<CatProps[], Error>({
        queryKey: ['cat'],
        queryFn: fetchCatUnfiltered,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
};
