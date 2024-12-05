import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.CAT_API_URL,
    headers: {
        'x-api-key': process.env.LIVE_API_KEY,
    },
});
