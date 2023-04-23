import './App.scss';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import NotFound from "./components/default-layout/notFound";
import './i18n.ts';
import { DefaultLayout } from './components/default-layout/layout';
import { Signin } from './components/pages/auth/signin';
import { Signup } from './components/pages/auth/signup';
import { AuthGuard, GlobalContextProvider } from './components/global-context';
import { TokenQR } from './components/pages/auth/2ftokenqr';
import { ResetPassword } from './components/pages/auth/reset-password';
import { ForgotCred } from './components/pages/auth/forgot-cred';

function App(props: any) {
    return (
        <GlobalContextProvider>
            <Router>
                <Routes>
                    <Route path={'/'} element={<Navigate to={'/signin'}/>}/>
                    <Route path={'/signin'} element={<Signin/>}/>
                    <Route path={'/signup'} element={<Signup/>}/>
                    <Route path={'/forgotPassword'} element={<ForgotCred credential='Password'/>}/>
                    <Route path={'/forgotToken'} element={<ForgotCred credential='Token'/>}/>
                    <Route path={'/resetPassword/:token'} element={<ResetPassword/>}/>
                    <Route path={'/resetToken/:token'} element={<TokenQR/>}/>
                    <Route path={'/resetToken'} element={<TokenQR/>}/>
                    <Route path={'/404'} element={<NotFound/>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                    <Route element={<AuthGuard/>}>
                        <Route path={'/d/*'} element={<DefaultLayout/>}/>
                    </Route>
                </Routes>
            </Router>
        </GlobalContextProvider>
    );
}

export default App;
