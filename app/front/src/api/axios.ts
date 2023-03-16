import axios from "axios";
import { useContext } from "react";
import { GlobalContext, GlobalContextType } from "../components/global-context";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const API = axios.create({
    baseURL: baseUrl
});