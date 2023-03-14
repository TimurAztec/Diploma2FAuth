import { Dispatch, SetStateAction, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createContext } from 'react';

interface AuthContextType {
    authenticated: boolean;
    setAuthenticated: Dispatch<SetStateAction<boolean>>;
    signin: (accessToken: string) => void;
    signout: () => void;
  }

const AuthContext = createContext<AuthContextType>({
    authenticated: false,
    setAuthenticated: () => {},
    signin: (accessToken: string) => {},
    signout: () => {},
});

function AuthGuard() {
    const [authenticated, setAuthenticated] = useState(false);

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
        <AuthContext.Provider value={{ authenticated, setAuthenticated, signin, signout }}>
            {authenticated ? <Outlet/> : <Navigate to="/"/>}
        </AuthContext.Provider>
    );
};

export { AuthGuard, AuthContext };
export type { AuthContextType };
