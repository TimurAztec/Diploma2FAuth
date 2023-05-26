import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { createContext } from 'react';
import { API } from '../api/axios';
import jwtDecode from 'jwt-decode';

interface GlobalContextType {
    authenticated: boolean;
    isLoaded: boolean;
    user: any;
    setAuthenticated: Dispatch<SetStateAction<boolean>>;
    signin: (accessToken: string) => void;
    signout: () => void;
  }

const GlobalContext = createContext<GlobalContextType>({
    authenticated: false,
    isLoaded: false,
    user: null,
    setAuthenticated: () => {},
    signin: (accessToken: string) => {},
    signout: () => {},
});

function GlobalContextProvider({children}: {children: any}) {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const accessToken: string | null = localStorage.getItem("accessToken");
        if (accessToken) {
            setAuthenticated(true);
            setUser(jwtDecode(accessToken));
        }
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
                signout();
            }
            return Promise.reject(error);
        });

        setIsLoaded(true);
    }, []);

    const signin = (accessToken: string) => {
        setAuthenticated(true);
        setUser(jwtDecode(accessToken));
        localStorage.setItem("accessToken", accessToken);
    };

    const signout = () => {
        setAuthenticated(false);
        setUser(null);
        if (localStorage.getItem("accessToken")) {
            localStorage.removeItem("accessToken");
        }
    };

    return (
        <GlobalContext.Provider value={{ authenticated, isLoaded, user, setAuthenticated, signin, signout }}>
            {isLoaded && children}
        </GlobalContext.Provider>
    );
}

function AuthGuard() {
    const {authenticated} = useContext(GlobalContext);

    return (
        authenticated ? <Outlet/> : <Navigate to="/"/>
    );
};

export { AuthGuard, GlobalContext, GlobalContextProvider };
export type { GlobalContextType };
