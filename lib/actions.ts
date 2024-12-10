"use server"

import { axiosInstance, axiosLikedCat } from "@/hook/client"
import { CatProps, LikedCatProps } from "@/types"
import { QueryFunctionContext } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';

export const fetchCat = async ({ pageParam = 0 }: QueryFunctionContext): Promise<CatProps[]> => {
    try {
        const response = await axiosInstance.get(`/breeds?limit=15&page=${pageParam}`);

        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch cat");
    }
};

export const fetchCatUnfiltered = async (): Promise<CatProps[]> => {
    try {
        const response = await axiosInstance.get(`/breeds`)
        return response.data
    } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch cat")
    }
}

export const fetchCatById = async (id: string): Promise<CatProps> => {
    try {
        const response = await axiosInstance.get(`/breeds/search?name=${id}`)

        console.log("data on server", response.data)

        return response.data
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch cat")
    }
}

export const fetchFavouriteCat = async (): Promise<LikedCatProps[]> => {
    try {
        const response = await axiosLikedCat.get('')

        return response.data
    } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch favourite cat")
    }
}

export const likedCatHandler = async (image_id: string) => {
    try {
        const response = await axiosLikedCat.post('', {
            image_id: image_id,
            sub_id: uuidv4()
        })

        console.log("liked cat", response.data)
        return response.data
    } catch (error) {
        console.error(error)
        throw new Error("Failed to like cat")
    }
}

export const deleteLikedCat = async (id: string) => {
    try {
        const response = await axiosLikedCat.delete(`/${id}`)

        console.log("deleted cat", response.data)
        return response.data
    } catch (error) {
        console.error(error)
        throw new Error("Failed to delete cat")
    }
}
