import { fetchCat, fetchCatById, fetchCatUnfiltered, fetchFavouriteCat } from "@/lib/actions";
import { CatProps, LikedCatProps } from "@/types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance, axiosLikedCat } from "./client";

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

export const useCatById = (id: string) => {
    return useQuery<CatProps | null, Error>({
        queryKey: ['car', id],
        queryFn: () => fetchCatById(id),
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}

export const useFavouriteCat = () => {
    return useQuery<LikedCatProps[], Error>({
        queryKey: ['favouriteCat'],
        queryFn: fetchFavouriteCat,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}
