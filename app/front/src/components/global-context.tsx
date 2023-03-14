import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createContext } from 'react';

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
