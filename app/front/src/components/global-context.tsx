import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { createContext } from 'react';
import { API } from '../api/axios';

interface GlobalContextType {
    authenticated: boolean;
    isLoaded: boolean;
    setAuthenticated: Dispatch<SetStateAction<boolean>>;
    signin: (accessToken: string) => void;
    signout: () => void;
  }

const GlobalContext = createContext<GlobalContextType>({
    authenticated: false,
    isLoaded: false,
    setAuthenticated: () => {},
    signin: (accessToken: string) => {},
    signout: () => {},
});

function GlobalContextProvider({children}: {children: any}) {
    const [authenticated, setAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setAuthenticated(true);
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
        localStorage.setItem("accessToken", accessToken);
    };

    const signout = () => {
        setAuthenticated(false);
        if (localStorage.getItem("accessToken")) {
            localStorage.removeItem("accessToken");
        }
    };

    return (
        <GlobalContext.Provider value={{ authenticated, isLoaded, setAuthenticated, signin, signout }}>
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
