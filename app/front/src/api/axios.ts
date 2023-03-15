import axios from "axios";
import { useContext } from "react";
import { GlobalContext, GlobalContextType } from "../components/global-context";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const API = axios.create({
    baseURL: baseUrl
});

API.interceptors.request.use((config: any) => {
    if (localStorage.getItem("accessToken")) {
        config.headers.Authorization = "Bearer " + localStorage.getItem("accessToken");
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

API.interceptors.response.use((response: any) => {
    return response;
}, (error) => {
    if (error.response.status == 401) {
        const authContext = useContext<GlobalContextType>(GlobalContext);
        authContext.signout();
    }
    return Promise.reject(error);
});