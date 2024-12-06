import { fetchCat } from "@/lib/actions";
import { CatProps } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query"

export const useInfiniteCat = () => {
    return useInfiniteQuery<CatProps[], Error>({
        queryKey: ['cats'],
        queryFn: fetchCat,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
};
