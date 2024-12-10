import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.CAT_API_URL,
    headers: {
        'x-api-key': process.env.LIVE_API_KEY,
    },
    timeout: 3000,
});

export const axiosLikedCat = axios.create({
    baseURL: process.env.LIKED_CAT_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.LIVE_API_KEY,
    },
})
