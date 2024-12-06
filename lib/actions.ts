"use server"

import { axiosInstance } from "@/hook/client"
import { CatProps } from "@/types"
import { QueryFunctionContext } from "@tanstack/react-query";

export const fetchCat = async ({ pageParam = 1 }: QueryFunctionContext): Promise<CatProps[]> => {
    try {
        const response = await axiosInstance.get(`/breeds`, {
            params: {
                limit: 9,
                page: pageParam,
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch cat");
    }
};
