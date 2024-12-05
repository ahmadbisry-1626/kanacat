"use server"

import { axiosInstance } from "@/hook/client"
import { CatProps } from "@/types"

export const fetchCat = async (page: number, limit: number): Promise<CatProps[]> => {
    try {
        const response = await axiosInstance.get(`/breeds?limit=${limit}&page=${page}`)

        return response.data
    } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch cat")
    }
}
