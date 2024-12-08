"use server"

import { axiosInstance } from "@/hook/client"
import { CatProps } from "@/types"
import { QueryFunctionContext } from "@tanstack/react-query";

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
