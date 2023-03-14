import axios from "axios";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../components/guards/AuthGuard";
export const API = axios.create({
    baseURL: 'http://localhost:3001'
});

API.interceptors.response.use((response: any) => {
    return response;
}, (error) => {
    if (error.response.status == 401) {
        const authContext = useContext<AuthContextType>(AuthContext);
        authContext.signout();
    }
    return Promise.reject(error);
});