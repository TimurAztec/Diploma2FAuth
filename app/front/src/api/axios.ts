import axios from "axios";
import { request } from "http";
import { useContext } from "react";
import { GlobalContext, GlobalContextType } from "../components/global-context";
export const API = axios.create({
    baseURL: 'http://localhost:3001'
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