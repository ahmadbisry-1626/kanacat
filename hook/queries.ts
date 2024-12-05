import { fetchCat } from "@/lib/actions";
import { CatProps } from "@/types";
import { useQuery } from "@tanstack/react-query"

export const useCat = (page: number, limit: number) => {
    return useQuery<CatProps[], Error>({
        queryKey: ['cat'],
        queryFn: () => fetchCat(page, limit),
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
};
