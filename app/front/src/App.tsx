import './App.scss';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import NotFound from "./components/default-layout/notFound";
import './i18n.ts';
import { DefaultLayout } from './components/default-layout/layout';
import { Signin } from './components/pages/auth/signin';
import { AuthGuard } from './components/guards/AuthGuard';
import { Signup } from './components/pages/auth/signup';

function App(props: any) {
    return (
        <Router>
            <Routes>
                <Route path={'/'} element={<Navigate to={'/signin'}/>}/>
                <Route path={'/signin'} element={<Signin/>}/>
                <Route path={'/signup'} element={<Signup/>}/>
                <Route path={'/404'} element={<NotFound/>}/>
                <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                <Route element={<AuthGuard/>}>
                    <Route path={'/d/*'} element={<DefaultLayout/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
